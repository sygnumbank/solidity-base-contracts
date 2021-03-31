require("chai").should();

const {
  expectRevert,
  BaseOperators,
  BlockerOperators,
  RaiseOperators,
  TraderOperators,
  OnboardRouter,
  InitializeRouter,
  Whitelist,
  ZERO_ADDRESS,
} = require("../../common");

contract("OnboardRouter", ([admin, secondAdmin, operator, system, superAdmin, blocker, investor, trader, relay, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.raiseOperators = await RaiseOperators.new({ from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });

    this.initializeRouter = await InitializeRouter.new({ from: admin });
    this.onboardRouter = await OnboardRouter.new({ from: admin });

    this.dchf = await Whitelist.new({ from: admin }); // mock of dchf requiring initialization

    this.whitelist = await Whitelist.new({ from: admin });
    this.whitelistNonDefault = await Whitelist.new({ from: admin });
  });

  context("initialization", () => {
    describe("necessary contract initialized", () => {
      beforeEach(async () => {
        await this.initializeRouter.initialize(this.baseOperators.address);
        await this.whitelistNonDefault.initialize(this.baseOperators.address);

        await this.onboardRouter.initialize(
          this.whitelist.address,
          this.baseOperators.address,
          this.raiseOperators.address,
          this.traderOperators.address,
          this.blockerOperators.address
        );
      });
      describe("contracts initialized", () => {
        describe("should call functions before initializeRoleContracts for non-functionality testing", () => {});
        beforeEach(async () => {
          await this.baseOperators.addRelay(this.onboardRouter.address, { from: admin });
          await this.initializeRouter.initializeContracts(
            ZERO_ADDRESS,
            this.raiseOperators.address,
            this.traderOperators.address,
            this.blockerOperators.address,
            this.dchf.address,
            this.whitelist.address,
            { from: admin }
          );
        });
        describe("admin functionality", () => {
          describe("onboardSystem", () => {
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.onboardSystem(system, ZERO_ADDRESS, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
            });
            describe("functional", () => {
              describe("default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardSystem(system, ZERO_ADDRESS, { from: admin });
                });
                it("system set", async () => {
                  assert.equal(await this.baseOperators.isSystem(system), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelist.isWhitelisted(system), true);
                });
                describe("deboard system", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardSystem(system, ZERO_ADDRESS, { from: admin });
                  });
                  it("system removed", async () => {
                    assert.equal(await this.baseOperators.isSystem(system), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(system), false);
                  });
                });
              });
              describe("non-default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardSystem(system, this.whitelistNonDefault.address, { from: admin });
                });
                it("system set", async () => {
                  assert.equal(await this.baseOperators.isSystem(system), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelistNonDefault.isWhitelisted(system), true);
                });
                describe("deboard system", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardSystem(system, this.whitelistNonDefault.address, { from: admin });
                  });
                  it("system removed", async () => {
                    assert.equal(await this.baseOperators.isSystem(system), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(system), false);
                  });
                });
              });
            });
          });
          describe("onboardSuperAdmin", () => {
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.onboardSuperAdmin(superAdmin, ZERO_ADDRESS, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
            });
            describe("functional", () => {
              describe("default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardSuperAdmin(superAdmin, ZERO_ADDRESS, { from: admin });
                });
                it("operator and admin set", async () => {
                  assert.equal(await this.baseOperators.isOperatorAndAdmin(superAdmin), true);
                });
                it("trader set", async () => {
                  assert.equal(await this.traderOperators.isTrader(superAdmin), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelist.isWhitelisted(superAdmin), true);
                });
                describe("deboard superAdmin", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardSuperAdmin(superAdmin, ZERO_ADDRESS, { from: admin });
                  });
                  describe("operator and admin removed", () => {
                    it("operator removed", async () => {
                      assert.equal(await this.baseOperators.isOperator(superAdmin), false);
                    });
                    it("admin removed", async () => {
                      assert.equal(await this.baseOperators.isAdmin(superAdmin), false);
                    });
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(superAdmin), false);
                  });
                });
              });
              describe("non-default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardSuperAdmin(superAdmin, this.whitelistNonDefault.address, { from: admin });
                });
                it("operator and admin set", async () => {
                  assert.equal(await this.baseOperators.isOperatorAndAdmin(superAdmin), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelistNonDefault.isWhitelisted(superAdmin), true);
                });
                describe("deboard superAdmin", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardSuperAdmin(superAdmin, this.whitelistNonDefault.address, { from: admin });
                  });
                  describe("operator and admin removed", () => {
                    it("operator removed", async () => {
                      assert.equal(await this.baseOperators.isOperator(superAdmin), false);
                    });
                    it("admin removed", async () => {
                      assert.equal(await this.baseOperators.isAdmin(superAdmin), false);
                    });
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(superAdmin), false);
                  });
                });
              });
            });
          });
          describe("onboardBlocker", () => {
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.onboardBlocker(blocker, ZERO_ADDRESS, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
            });
            describe("functional", () => {
              describe("default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardBlocker(blocker, ZERO_ADDRESS, { from: admin });
                });
                it("blocker set", async () => {
                  assert.equal(await this.blockerOperators.isBlocker(blocker), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelist.isWhitelisted(blocker), true);
                });
                describe("deboard blocker", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardBlocker(blocker, ZERO_ADDRESS, { from: admin });
                  });
                  it("trader removed", async () => {
                    assert.equal(await this.blockerOperators.isBlocker(blocker), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(blocker), false);
                  });
                });
              });
              describe("non-default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardBlocker(blocker, this.whitelistNonDefault.address, { from: admin });
                });
                it("blocker set", async () => {
                  assert.equal(await this.blockerOperators.isBlocker(blocker), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelistNonDefault.isWhitelisted(blocker), true);
                });
                describe("deboard blocker", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardBlocker(blocker, this.whitelistNonDefault.address, { from: admin });
                  });
                  it("trader removed", async () => {
                    assert.equal(await this.blockerOperators.isBlocker(blocker), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(blocker), false);
                  });
                });
              });
            });
          });
          describe("onboardTrader", () => {
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.onboardTrader(trader, ZERO_ADDRESS, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
            });
            describe("functional", () => {
              describe("default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardTrader(trader, ZERO_ADDRESS, { from: admin });
                });
                it("trader set", async () => {
                  assert.equal(await this.traderOperators.isTrader(trader), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelist.isWhitelisted(trader), true);
                });
                describe("deboard superAdmin", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardTrader(trader, ZERO_ADDRESS, { from: admin });
                  });
                  it("trader removed", async () => {
                    assert.equal(await this.traderOperators.isTrader(trader), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(trader), false);
                  });
                });
              });
              describe("non-default whitelist", () => {
                beforeEach(async () => {
                  await this.onboardRouter.onboardTrader(trader, this.whitelistNonDefault.address, { from: admin });
                });
                it("trader set", async () => {
                  assert.equal(await this.traderOperators.isTrader(trader), true);
                });
                it("default whitelist set", async () => {
                  assert.equal(await this.whitelistNonDefault.isWhitelisted(trader), true);
                });
                describe("deboard superAdmin", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.deboardTrader(trader, this.whitelistNonDefault.address, { from: admin });
                  });
                  it("trader removed", async () => {
                    assert.equal(await this.traderOperators.isTrader(trader), false);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(trader), false);
                  });
                });
              });
            });
          });
          describe("change functionality", () => {
            describe("admin set", () => {
              beforeEach(async () => {
                await this.baseOperators.addAdmin(secondAdmin, { from: admin });
              });
              describe("changeAdminToTrader", () => {
                describe("non-functional", () => {
                  it("revert from attacker", async () => {
                    await expectRevert(
                      this.onboardRouter.changeAdminToTrader(secondAdmin, ZERO_ADDRESS, { from: attacker }),
                      "Operatorable: caller does not have the admin role"
                    );
                  });
                  describe("when admin not set", () => {
                    beforeEach(async () => {
                      await this.baseOperators.removeAdmin(secondAdmin, { from: admin });
                    });
                    it("revert chaning admin to trader", async () => {
                      await expectRevert(
                        this.onboardRouter.changeAdminToTrader(secondAdmin, ZERO_ADDRESS, { from: admin }),
                        "Roles: account does not have role"
                      );
                    });
                  });
                });
                describe("functional", () => {
                  describe("default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeAdminToTrader(secondAdmin, ZERO_ADDRESS, { from: admin });
                    });
                    it("admin removed", async () => {
                      assert.equal(await this.baseOperators.isAdmin(secondAdmin), false);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(secondAdmin), true);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(secondAdmin), true);
                    });
                  });
                  describe("non-default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeAdminToTrader(secondAdmin, this.whitelistNonDefault.address, { from: admin });
                    });
                    it("admin removed", async () => {
                      assert.equal(await this.baseOperators.isAdmin(secondAdmin), false);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(secondAdmin), true);
                    });
                    it("non-default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(secondAdmin), true);
                    });
                  });
                });
              });
              describe("changeAdminToSuperAdmin", () => {
                describe("non-functional", () => {
                  it("revert from attacker", async () => {
                    await expectRevert(
                      this.onboardRouter.changeAdminToSuperAdmin(investor, this.whitelistNonDefault.address, { from: attacker }),
                      "Operatorable: caller does not have the admin role"
                    );
                  });
                  describe("when admin not set", () => {
                    beforeEach(async () => {
                      await this.baseOperators.removeAdmin(secondAdmin, { from: admin });
                    });
                    it("revert chaning admin to super admin", async () => {
                      await expectRevert(
                        this.onboardRouter.changeAdminToSuperAdmin(secondAdmin, this.whitelistNonDefault.address, { from: admin }),
                        "OnboardRouter: selected account does not have admin privileges"
                      );
                    });
                  });
                });
                describe("functional", () => {
                  describe("default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeAdminToSuperAdmin(secondAdmin, ZERO_ADDRESS, { from: admin });
                    });
                    it("admin and operator set", async () => {
                      assert.equal(await this.baseOperators.isOperatorAndAdmin(secondAdmin), true);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(secondAdmin), true);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(secondAdmin), true);
                    });
                  });
                  describe("non-default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeAdminToSuperAdmin(secondAdmin, this.whitelistNonDefault.address, { from: admin });
                    });
                    it("admin and operator set", async () => {
                      assert.equal(await this.baseOperators.isOperatorAndAdmin(secondAdmin), true);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(secondAdmin), true);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(secondAdmin), true);
                    });
                  });
                });
              });
            });
            describe("operator set", () => {
              beforeEach(async () => {
                await this.baseOperators.addOperator(operator, { from: admin });
              });
              describe("changeOperatorToTrader", () => {
                describe("non-functional", () => {
                  it("revert from attacker", async () => {
                    await expectRevert(
                      this.onboardRouter.changeOperatorToTrader(operator, ZERO_ADDRESS, { from: attacker }),
                      "Operatorable: caller does not have the admin role"
                    );
                  });
                  describe("when operator not set", () => {
                    beforeEach(async () => {
                      await this.baseOperators.removeOperator(operator, { from: admin });
                    });
                    it("revert chaning admin to trader", async () => {
                      await expectRevert(
                        this.onboardRouter.changeOperatorToTrader(operator, ZERO_ADDRESS, { from: admin }),
                        "Roles: account does not have role"
                      );
                    });
                  });
                });
                describe("functional", () => {
                  describe("default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeOperatorToTrader(operator, ZERO_ADDRESS, { from: admin });
                    });
                    it("operator removed", async () => {
                      assert.equal(await this.baseOperators.isOperator(operator), false);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(operator), true);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(operator), true);
                    });
                  });
                  describe("non-default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeOperatorToTrader(operator, this.whitelistNonDefault.address, { from: admin });
                    });
                    it("operator removed", async () => {
                      assert.equal(await this.baseOperators.isOperator(operator), false);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(operator), true);
                    });
                    it("non-default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(operator), true);
                    });
                  });
                });
              });
              describe("changeOperatorToSuperAdmin", () => {
                describe("non-functional", () => {
                  it("revert from attacker", async () => {
                    await expectRevert(
                      this.onboardRouter.changeOperatorToSuperAdmin(operator, ZERO_ADDRESS, { from: attacker }),
                      "Operatorable: caller does not have the admin role"
                    );
                  });
                  describe("when operator not set", () => {
                    beforeEach(async () => {
                      await this.baseOperators.removeOperator(operator, { from: admin });
                    });
                    it("revert chaning admin to trader", async () => {
                      await expectRevert(
                        this.onboardRouter.changeOperatorToSuperAdmin(operator, ZERO_ADDRESS, { from: admin }),
                        "OnboardRouter: selected account does not have operator privileges"
                      );
                    });
                  });
                });
                describe("functional", () => {
                  describe("default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeOperatorToSuperAdmin(operator, ZERO_ADDRESS, { from: admin });
                    });
                    it("operator and admin set", async () => {
                      assert.equal(await this.baseOperators.isOperatorAndAdmin(operator), true);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(operator), true);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(operator), true);
                    });
                  });
                  describe("non-default whitelist", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.changeOperatorToSuperAdmin(operator, this.whitelistNonDefault.address, { from: admin });
                    });
                    it("operator and admin set", async () => {
                      assert.equal(await this.baseOperators.isOperatorAndAdmin(operator), true);
                    });
                    it("trader set", async () => {
                      assert.equal(await this.traderOperators.isTrader(operator), true);
                    });
                    it("non-default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(operator), true);
                    });
                  });
                });
              });
            });
            describe("trader set", () => {
              describe("operator set", () => {
                beforeEach(async () => {
                  await this.baseOperators.addOperator(operator, { from: admin });
                });
                describe("when trader set", () => {
                  beforeEach(async () => {
                    await this.traderOperators.addTrader(trader, { from: admin });
                  });
                  describe("changeTraderToOperator", () => {
                    describe("non-functional", () => {
                      it("revert from attacker", async () => {
                        await expectRevert(
                          this.onboardRouter.changeTraderToOperator(trader, ZERO_ADDRESS, { from: attacker }),
                          "Operatorable: caller does not have the admin role"
                        );
                      });
                      describe("when trader not set", () => {
                        beforeEach(async () => {
                          await this.traderOperators.removeTrader(trader, { from: admin });
                        });
                        it("revert changing trader to operator", async () => {
                          await expectRevert(
                            this.onboardRouter.changeTraderToOperator(trader, ZERO_ADDRESS, { from: admin }),
                            "Roles: account does not have role"
                          );
                        });
                      });
                    });
                    describe("functional", () => {
                      describe("default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeTraderToOperator(trader, ZERO_ADDRESS, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(trader), false);
                        });
                        it("operator set", async () => {
                          assert.equal(await this.baseOperators.isOperator(trader), true);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelist.isWhitelisted(trader), false);
                        });
                      });
                      describe("non-default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeTraderToOperator(trader, this.whitelistNonDefault.address, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(trader), false);
                        });
                        it("operator set", async () => {
                          assert.equal(await this.baseOperators.isOperator(trader), true);
                        });
                        it("non-default de-whitelisted", async () => {
                          assert.equal(await this.whitelistNonDefault.isWhitelisted(trader), false);
                        });
                      });
                    });
                  });
                  describe("changeTraderToAdmin", () => {
                    describe("non-functional", () => {
                      it("revert from attacker", async () => {
                        await expectRevert(
                          this.onboardRouter.changeTraderToAdmin(trader, ZERO_ADDRESS, { from: attacker }),
                          "Operatorable: caller does not have the admin role"
                        );
                      });
                      describe("when trader not set", () => {
                        beforeEach(async () => {
                          await this.traderOperators.removeTrader(trader, { from: admin });
                        });
                        it("revert chaning admin to trader", async () => {
                          await expectRevert(
                            this.onboardRouter.changeTraderToAdmin(trader, ZERO_ADDRESS, { from: admin }),
                            "Roles: account does not have role"
                          );
                        });
                      });
                    });
                    describe("functional", () => {
                      describe("default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeTraderToAdmin(trader, ZERO_ADDRESS, { from: admin });
                        });
                        it("admin set", async () => {
                          assert.equal(await this.baseOperators.isAdmin(trader), true);
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(trader), false);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelist.isWhitelisted(trader), false);
                        });
                      });
                      describe("non-default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeTraderToAdmin(trader, this.whitelistNonDefault.address, { from: admin });
                        });
                        it("admin set", async () => {
                          assert.equal(await this.baseOperators.isAdmin(trader), true);
                        });
                        it("trader set", async () => {
                          assert.equal(await this.traderOperators.isTrader(trader), false);
                        });
                        it("non-default whitelist set", async () => {
                          assert.equal(await this.whitelistNonDefault.isWhitelisted(trader), false);
                        });
                      });
                    });
                  });
                });
              });
            });
            describe("superAdmin set", () => {
              describe("trader set", () => {
                beforeEach(async () => {
                  await this.traderOperators.addTrader(superAdmin, { from: admin });
                });
                describe("when superAdmin set", () => {
                  beforeEach(async () => {
                    await this.baseOperators.addOperatorAndAdmin(superAdmin, { from: admin });
                  });
                  describe("changeSuperAdminToAdmin", () => {
                    describe("non-functional", () => {
                      it("revert from attacker", async () => {
                        await expectRevert(
                          this.onboardRouter.changeSuperAdminToAdmin(superAdmin, ZERO_ADDRESS, { from: attacker }),
                          "Operatorable: caller does not have the admin role"
                        );
                      });
                      it("revert when account not admin", async () => {
                        await expectRevert(
                          this.onboardRouter.changeSuperAdminToAdmin(attacker, ZERO_ADDRESS, { from: admin }),
                          "OnboardRouter: account is not admin"
                        );
                      });
                      describe("when trader not set", () => {
                        beforeEach(async () => {
                          await this.traderOperators.removeTrader(superAdmin, { from: admin });
                        });
                        it("revert changing trader to operator", async () => {
                          await expectRevert(
                            this.onboardRouter.changeSuperAdminToAdmin(superAdmin, ZERO_ADDRESS, { from: admin }),
                            "Roles: account does not have role"
                          );
                        });
                      });
                    });
                    describe("functional", () => {
                      describe("default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeSuperAdminToAdmin(superAdmin, ZERO_ADDRESS, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(superAdmin), false);
                        });
                        it("operator removed", async () => {
                          assert.equal(await this.baseOperators.isOperator(superAdmin), false);
                        });
                        it("admin set", async () => {
                          assert.equal(await this.baseOperators.isAdmin(superAdmin), true);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelist.isWhitelisted(superAdmin), false);
                        });
                      });
                      describe("non-default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeSuperAdminToAdmin(superAdmin, this.whitelistNonDefault.address, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(superAdmin), false);
                        });
                        it("operator removed", async () => {
                          assert.equal(await this.baseOperators.isOperator(superAdmin), false);
                        });
                        it("admin set", async () => {
                          assert.equal(await this.baseOperators.isAdmin(superAdmin), true);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelistNonDefault.isWhitelisted(superAdmin), false);
                        });
                      });
                    });
                  });
                  describe("changeSuperAdminToOperator", () => {
                    describe("non-functional", () => {
                      it("revert from attacker", async () => {
                        await expectRevert(
                          this.onboardRouter.changeSuperAdminToOperator(superAdmin, ZERO_ADDRESS, { from: attacker }),
                          "Operatorable: caller does not have the admin role"
                        );
                      });
                      it("revert when account not admin", async () => {
                        await expectRevert(
                          this.onboardRouter.changeSuperAdminToOperator(attacker, ZERO_ADDRESS, { from: admin }),
                          "OnboardRouter: account is not admin"
                        );
                      });
                      describe("when trader not set", () => {
                        beforeEach(async () => {
                          await this.traderOperators.removeTrader(superAdmin, { from: admin });
                        });
                        it("revert changing trader to operator", async () => {
                          await expectRevert(
                            this.onboardRouter.changeSuperAdminToOperator(superAdmin, ZERO_ADDRESS, { from: admin }),
                            "Roles: account does not have role"
                          );
                        });
                      });
                    });
                    describe("functional", () => {
                      describe("default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeSuperAdminToOperator(superAdmin, ZERO_ADDRESS, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(superAdmin), false);
                        });
                        it("admin removed", async () => {
                          assert.equal(await this.baseOperators.isAdmin(superAdmin), false);
                        });
                        it("operator set", async () => {
                          assert.equal(await this.baseOperators.isOperator(superAdmin), true);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelist.isWhitelisted(superAdmin), false);
                        });
                      });
                      describe("non-default whitelist", () => {
                        beforeEach(async () => {
                          await this.onboardRouter.changeSuperAdminToOperator(superAdmin, this.whitelistNonDefault.address, { from: admin });
                        });
                        it("trader removed", async () => {
                          assert.equal(await this.traderOperators.isTrader(superAdmin), false);
                        });
                        it("admin removed", async () => {
                          assert.equal(await this.baseOperators.isAdmin(superAdmin), false);
                        });
                        it("operator set", async () => {
                          assert.equal(await this.baseOperators.isOperator(superAdmin), true);
                        });
                        it("default de-whitelisted", async () => {
                          assert.equal(await this.whitelist.isWhitelisted(superAdmin), false);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
        describe("operator and system functionality", () => {
          describe("onboardInvestor", () => {
            describe("from operator", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(
                    this.onboardRouter.onboardInvestor(investor, ZERO_ADDRESS, { from: attacker }),
                    "Operatorable: caller does not have the operator role nor system"
                  );
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.baseOperators.addOperator(operator, { from: admin });
                });
                describe("default whitelist", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.onboardInvestor(investor, ZERO_ADDRESS, { from: operator });
                  });
                  it("trader set", async () => {
                    assert.equal(await this.raiseOperators.isInvestor(investor), true);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(investor), true);
                  });
                  describe("deboard investor", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.deboardInvestor(investor, ZERO_ADDRESS, { from: operator });
                    });
                    it("trader removed", async () => {
                      assert.equal(await this.raiseOperators.isInvestor(investor), false);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(investor), false);
                    });
                  });
                });
                describe("non-default whitelist", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.onboardInvestor(investor, this.whitelistNonDefault.address, { from: operator });
                  });
                  it("trader set", async () => {
                    assert.equal(await this.raiseOperators.isInvestor(investor), true);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(investor), true);
                  });
                  describe("deboard investor", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.deboardInvestor(investor, this.whitelistNonDefault.address, { from: operator });
                    });
                    it("trader removed", async () => {
                      assert.equal(await this.raiseOperators.isInvestor(investor), false);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(investor), false);
                    });
                  });
                });
              });
            });
            describe("from system", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(
                    this.onboardRouter.onboardInvestor(investor, ZERO_ADDRESS, { from: attacker }),
                    "Operatorable: caller does not have the operator role nor system"
                  );
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.baseOperators.addSystem(system, { from: admin });
                });
                describe("default whitelist", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.onboardInvestor(investor, ZERO_ADDRESS, { from: system });
                  });
                  it("trader set", async () => {
                    assert.equal(await this.raiseOperators.isInvestor(investor), true);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelist.isWhitelisted(investor), true);
                  });
                  describe("deboard investor", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.deboardInvestor(investor, ZERO_ADDRESS, { from: system });
                    });
                    it("trader removed", async () => {
                      assert.equal(await this.raiseOperators.isInvestor(investor), false);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelist.isWhitelisted(investor), false);
                    });
                  });
                });
                describe("non-default whitelist", () => {
                  beforeEach(async () => {
                    await this.onboardRouter.onboardInvestor(investor, this.whitelistNonDefault.address, { from: system });
                  });
                  it("trader set", async () => {
                    assert.equal(await this.raiseOperators.isInvestor(investor), true);
                  });
                  it("default whitelist set", async () => {
                    assert.equal(await this.whitelistNonDefault.isWhitelisted(investor), true);
                  });
                  describe("deboard investor", () => {
                    beforeEach(async () => {
                      await this.onboardRouter.deboardInvestor(investor, this.whitelistNonDefault.address, { from: system });
                    });
                    it("trader removed", async () => {
                      assert.equal(await this.raiseOperators.isInvestor(investor), false);
                    });
                    it("default whitelist set", async () => {
                      assert.equal(await this.whitelistNonDefault.isWhitelisted(investor), false);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
