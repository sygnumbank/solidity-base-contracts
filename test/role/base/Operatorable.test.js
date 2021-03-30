require("chai").should();

const { expectRevert, Operatorable, BaseOperators, MultisigMock, ZERO_ADDRESS } = require("../../common");

contract("Operatorable", ([owner, admin, admin2, operator, operator2, system, system2, relay, relay2, multisig, multisig2, user, attacker, random]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.operatorable = await Operatorable.new({ from: admin });
  });
  it("revert initialization with zero addr", async () => {
    await expectRevert(this.operatorable.initialize(ZERO_ADDRESS), "Operatorable: address of new operators contract cannot be zero");
  });

  context("operatorable initialized", () => {
    beforeEach(async () => {
      await this.operatorable.initialize(this.baseOperators.address);
    });
    describe("initial baseOperators setup", () => {
      it("admin set", async () => {
        assert.equal(await this.baseOperators.isAdmin(admin), true);
      });
      it("deployer is not admin", async () => {
        assert.equal(await this.baseOperators.isAdmin(owner), false);
      });
    });

    describe("initial operatorable setup", () => {
      it("check isInitialized", async () => {
        assert.equal(await this.operatorable.isInitialized(), true);
      });
      it("can not be initialized twice", async () => {
        await expectRevert(this.operatorable.initialize(this.baseOperators.address), "Initializable: Contract instance has already been initialized");
      });
    });

    context("managing admins", () => {
      describe("non-functional", () => {
        it("revert admin can not remove not existing admin", async () => {
          await expectRevert(this.baseOperators.removeAdmin(admin2, { from: admin }), "Roles: account does not have role");
        });
        it("revert removing admin with zero addr", async () => {
          await expectRevert(this.baseOperators.removeAdmin(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
        it("revert adding admin with zero addr", async () => {
          await expectRevert(this.baseOperators.addAdmin(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
      });
      describe("functional", () => {
        describe("from admin", () => {
          beforeEach(async () => {
            await this.baseOperators.addAdmin(admin2, { from: admin });
          });
          it("admin set", async () => {
            assert.equal(await this.baseOperators.isAdmin(admin2), true);
          });
          it("admin or operator getter", async () => {
            assert.equal(await this.baseOperators.isOperatorOrAdmin(admin2), true);
          });
        });
        describe("from relay", () => {
          beforeEach(async () => {
            await this.baseOperators.addRelay(relay, { from: admin });
          });
          describe("when relay set", () => {
            beforeEach(async () => {
              await this.baseOperators.addAdmin(admin2, { from: relay });
            });
            it("admin set", async () => {
              assert.equal(await this.baseOperators.isAdmin(admin2), true);
            });
          });
        });
      });
      context("multi admins", () => {
        beforeEach(async () => {
          await this.baseOperators.addAdmin(admin2, { from: admin });
        });
        describe("non-functional", () => {
          it("revert admin remove themself", async () => {
            await expectRevert(this.baseOperators.removeAdmin(admin, { from: admin }), "BaseOperators: admin can not remove himself");
          });
        });
        describe("functional", () => {
          describe("from admin", () => {
            beforeEach(async () => {
              await this.baseOperators.removeAdmin(admin2, { from: admin });
            });
            it("admin removed", async () => {
              assert.equal(await this.baseOperators.isAdmin(admin2), false);
            });
          });
          describe("from relay", () => {
            beforeEach(async () => {
              await this.baseOperators.addRelay(relay, { from: admin });
            });
            describe("when relay set", () => {
              beforeEach(async () => {
                await this.baseOperators.removeAdmin(admin2, { from: relay });
              });
              it("admin removed", async () => {
                assert.equal(await this.baseOperators.isAdmin(admin2), false);
              });
            });
          });
        });
      });
    });
    context("managing operators", () => {
      describe("non-functional", () => {
        it("revert removing operator with zero addr", async () => {
          await expectRevert(this.baseOperators.removeOperator(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
        it("revert adding operator with zero addr", async () => {
          await expectRevert(this.baseOperators.addOperator(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
      });
      describe("functional", () => {
        describe("from admin", () => {
          beforeEach(async () => {
            await this.baseOperators.addOperator(operator, { from: admin });
          });
          it("operator set", async () => {
            assert.equal(await this.baseOperators.isOperator(operator), true);
          });
          it("admin or operator getter", async () => {
            assert.equal(await this.baseOperators.isOperatorOrAdmin(operator), true);
          });
        });
        describe("from relay", () => {
          beforeEach(async () => {
            await this.baseOperators.addRelay(relay, { from: admin });
          });
          describe("when relay set", () => {
            beforeEach(async () => {
              await this.baseOperators.addOperator(operator, { from: relay });
            });
            it("operator set", async () => {
              assert.equal(await this.baseOperators.isOperator(operator), true);
            });
          });
        });
      });
      context("multi operators", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
          await this.baseOperators.addOperator(operator2, { from: admin });
        });
        describe("non-functional", () => {
          it("revert operator adding operator", async () => {
            await expectRevert(this.baseOperators.addOperator(user, { from: operator }), "BaseOperators: caller does not have the admin role");
          });
        });
        describe("functional", () => {
          describe("from admin", () => {
            beforeEach(async () => {
              await this.baseOperators.removeOperator(operator, { from: admin });
            });
            it("operator removed", async () => {
              assert.equal(await this.baseOperators.isOperator(operator), false);
            });
          });
          describe("from relay", () => {
            beforeEach(async () => {
              await this.baseOperators.addRelay(relay, { from: admin });
            });
            describe("when relay set", () => {
              beforeEach(async () => {
                await this.baseOperators.removeOperator(operator, { from: relay });
              });
              it("operator removed", async () => {
                assert.equal(await this.baseOperators.isOperator(operator), false);
              });
            });
          });
        });
      });
    });
    context("managing admin operators", () => {
      beforeEach(async () => {
        await this.baseOperators.addAdmin(admin2, { from: admin });
        await this.baseOperators.addOperator(operator, { from: admin });
      });
      describe("changeToOperator", () => {
        describe("non-functional", () => {
          it("revert caller attacker", async () => {
            await expectRevert(this.baseOperators.changeToOperator(admin, { from: attacker }), "BaseOperators: caller does not have the admin role");
          });
          it("revert admin caller cannot change themselves", async () => {
            await expectRevert(this.baseOperators.changeToOperator(admin, { from: admin }), "BaseOperators: admin can not change himself");
          });
          it("revert account change not admin", async () => {
            await expectRevert(this.baseOperators.changeToOperator(operator, { from: admin }), "Roles: account does not have role");
          });
          describe("operator and admin active", () => {
            beforeEach(async () => {
              await this.baseOperators.addOperator(admin2, { from: admin });
            });
            it("operator and admin set", async () => {
              assert.equal(await this.baseOperators.isOperatorAndAdmin(admin2), true);
            });
            describe("non-functional", () => {
              it("revert add super admin if already operator & admin", async () => {
                await expectRevert(this.baseOperators.changeToOperator(admin2, { from: admin }), "Roles: account already has role");
              });
            });
          });
        });
        describe("functional", () => {
          beforeEach(async () => {
            await this.baseOperators.changeToOperator(admin2, { from: admin });
          });
          it("admin role not active", async () => {
            assert.equal(await this.baseOperators.isAdmin(admin2), false);
          });
          it("new operator role active", async () => {
            assert.equal(await this.baseOperators.isOperator(admin2), true);
          });
        });
      });
      describe("changeToAdmin", () => {
        describe("non-functional", () => {
          it("revert caller not admin", async () => {
            await expectRevert(this.baseOperators.changeToAdmin(admin, { from: operator }), "BaseOperators: caller does not have the admin role");
          });
          it("revert admin caller cannot change themselves", async () => {
            await expectRevert(this.baseOperators.changeToAdmin(admin, { from: admin }), "Roles: account already has role");
          });
          it("revert admin already", async () => {
            await expectRevert(this.baseOperators.changeToAdmin(admin2, { from: admin }), "Roles: account already has role");
          });
          it("revert operator not assigned", async () => {
            await expectRevert(this.baseOperators.changeToAdmin(random, { from: admin }), "Roles: account does not have role");
          });
          describe("super admin active", () => {
            beforeEach(async () => {
              await this.baseOperators.addAdmin(operator, { from: admin });
              assert.equal(await this.baseOperators.isAdmin(operator), true);
            });
            it("revert add super admin if already super admin", async () => {
              await expectRevert(this.baseOperators.changeToOperator(operator, { from: admin }), "Roles: account already has role");
            });
          });
        });
        describe("functional", () => {
          beforeEach(async () => {
            await this.baseOperators.changeToOperator(admin2, { from: admin });
          });
          it("admin role not active", async () => {
            assert.equal(await this.baseOperators.isAdmin(admin2), false);
          });
          it("new operator role active", async () => {
            assert.equal(await this.baseOperators.isOperator(admin2), true);
          });
        });
      });
      describe("addOperatorAndAdmin", () => {
        describe("non-functional", () => {
          it("revert caller not admin/relay", async () => {
            await expectRevert(this.baseOperators.addOperatorAndAdmin(random, { from: attacker }), "BaseOperators: caller does not have the admin role");
          });
          it("revert account already has admin role", async () => {
            await expectRevert(this.baseOperators.addOperatorAndAdmin(admin2, { from: admin }), "Roles: account already has role");
          });
          it("revert account already has operator role", async () => {
            await expectRevert(this.baseOperators.addOperatorAndAdmin(operator, { from: admin }), "Roles: account already has role");
          });
        });
        describe("functional", () => {
          describe("from admin", () => {
            beforeEach(async () => {
              await this.baseOperators.addOperatorAndAdmin(random, { from: admin });
            });
            it("new admin role active", async () => {
              assert.equal(await this.baseOperators.isAdmin(random), true);
            });
            it("new operator role active", async () => {
              assert.equal(await this.baseOperators.isOperator(random), true);
            });
            it("new admin and operator role active", async () => {
              assert.equal(await this.baseOperators.isOperatorAndAdmin(random), true);
            });
          });
          describe("from relay", () => {
            beforeEach(async () => {
              await this.baseOperators.addRelay(relay, { from: admin });
            });
            describe("when relay set", () => {
              beforeEach(async () => {
                await this.baseOperators.addOperatorAndAdmin(random, { from: relay });
              });
              it("new admin role active", async () => {
                assert.equal(await this.baseOperators.isAdmin(random), true);
              });
              it("new operator role active", async () => {
                assert.equal(await this.baseOperators.isOperator(random), true);
              });
              it("new admin and operator role active", async () => {
                assert.equal(await this.baseOperators.isOperatorAndAdmin(random), true);
              });
            });
          });
        });
      });
      describe("removeOperatorAndAdmin", () => {
        describe("non-functional", () => {
          it("revert caller not admin", async () => {
            await expectRevert(this.baseOperators.removeOperatorAndAdmin(admin, { from: operator }), "BaseOperators: caller does not have the admin role");
          });
          it("revert caller same as account removal", async () => {
            await expectRevert(this.baseOperators.removeOperatorAndAdmin(admin, { from: admin }), "BaseOperators: admin can not remove himself");
          });
          it("revert account does not have admin role", async () => {
            await expectRevert(this.baseOperators.removeOperatorAndAdmin(operator, { from: admin }), "Roles: account does not have role");
          });
          it("revert account does not have operator role", async () => {
            await expectRevert(this.baseOperators.removeOperatorAndAdmin(admin2, { from: admin }), "Roles: account does not have role");
          });
        });
        describe("functional", () => {
          beforeEach(async () => {
            await this.baseOperators.addOperatorAndAdmin(random, { from: admin });
          });
          describe("from admin", () => {
            beforeEach(async () => {
              await this.baseOperators.removeOperatorAndAdmin(random, { from: admin });
            });
            it("admin role not active", async () => {
              assert.equal(await this.baseOperators.isAdmin(random), false);
            });
            it("operator role not active", async () => {
              assert.equal(await this.baseOperators.isOperator(random), false);
            });
          });
          describe("from relay", () => {
            beforeEach(async () => {
              await this.baseOperators.addRelay(relay, { from: admin });
            });
            describe("when relay set", () => {
              beforeEach(async () => {
                await this.baseOperators.removeOperatorAndAdmin(random, { from: relay });
              });
              it("admin role not active", async () => {
                assert.equal(await this.baseOperators.isAdmin(random), false);
              });
              it("operator role not active", async () => {
                assert.equal(await this.baseOperators.isOperator(random), false);
              });
            });
          });
        });
      });
    });
    context("managing systems", () => {
      beforeEach(async () => {
        await this.baseOperators.addRelay(relay, { from: admin });
      });
      describe("non-functional", () => {
        it("revert admin removing non-existing system", async () => {
          await expectRevert(this.baseOperators.removeSystem(system, { from: admin }), "Roles: account does not have role");
        });
        it("revert removing system with zero addr", async () => {
          await expectRevert(this.baseOperators.removeSystem(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
        it("revert adding system with zero addr", async () => {
          await expectRevert(this.baseOperators.addSystem(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
      });
      describe("functional", () => {
        describe("from admin", () => {
          describe("can add system", () => {
            beforeEach(async () => {
              await this.baseOperators.addSystem(system, { from: admin });
            });
            it("system added", async () => {
              assert.equal(await this.baseOperators.isSystem(system), true);
            });
          });
        });
        describe("from relay", () => {
          describe("can add system", () => {
            beforeEach(async () => {
              await this.baseOperators.addSystem(system, { from: relay });
            });
            it("system added", async () => {
              assert.equal(await this.baseOperators.isSystem(system), true);
            });
          });
        });
      });
      context("multi system accounts", () => {
        beforeEach(async () => {
          await this.baseOperators.addSystem(system, { from: admin });
          await this.baseOperators.addSystem(system2, { from: admin });
        });
        describe("non-functional", () => {
          it("revert system adding system", async () => {
            await expectRevert(this.baseOperators.addSystem(user, { from: system }), "BaseOperators: caller does not have the admin role");
          });
          it("revert system removing another system", async () => {
            await expectRevert(this.baseOperators.removeSystem(system2, { from: system }), "BaseOperators: caller does not have the admin role");
          });
          it("revert system removing themself", async () => {
            await expectRevert(this.baseOperators.removeSystem(system, { from: system }), "BaseOperators: caller does not have the admin role");
          });
        });
        describe("functional", () => {
          describe("from admin", () => {
            describe("can remove system", () => {
              beforeEach(async () => {
                await this.baseOperators.removeSystem(system, { from: admin });
              });
              it("system removed", async () => {
                assert.equal(await this.baseOperators.isSystem(system), false);
              });
            });
          });
          describe("from relay", () => {
            describe("can remove system", () => {
              beforeEach(async () => {
                await this.baseOperators.removeSystem(system, { from: relay });
              });
              it("system removed", async () => {
                assert.equal(await this.baseOperators.isSystem(system), false);
              });
            });
          });
        });
      });
    });
    context("managing relay contract addresses", () => {
      describe("non-functional", () => {
        it("revert admin removing non-existing relay", async () => {
          await expectRevert(this.baseOperators.removeRelay(relay, { from: admin }), "Roles: account does not have role");
        });
        it("revert removing relay with zero addr", async () => {
          await expectRevert(this.baseOperators.removeRelay(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
        it("revert adding relay with zero addr", async () => {
          await expectRevert(this.baseOperators.addRelay(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
      });
      describe("functional", () => {
        describe("admin can add relay", async () => {
          beforeEach(async () => {
            await this.baseOperators.addRelay(relay, { from: admin });
          });
          it("relay set", async () => {
            assert.equal(await this.baseOperators.isRelay(relay), true);
          });
        });
      });
      context("multi relay accounts", () => {
        beforeEach(async () => {
          await this.baseOperators.addRelay(relay, { from: admin });
          await this.baseOperators.addRelay(relay2, { from: admin });
        });
        describe("non-functional", () => {
          it("revert relay adding relay", async () => {
            await expectRevert(this.baseOperators.addRelay(user, { from: relay }), "BaseOperators: caller does not have the admin role");
          });
          it("revert relay removing another relay", async () => {
            await expectRevert(this.baseOperators.removeRelay(relay2, { from: relay }), "BaseOperators: caller does not have the admin role");
          });
          it("revert relay removing themself", async () => {
            await expectRevert(this.baseOperators.removeRelay(relay, { from: relay }), "BaseOperators: caller does not have the admin role");
          });
        });
        describe("functional", () => {
          describe("admin can remove relay", async () => {
            beforeEach(async () => {
              await this.baseOperators.removeRelay(relay, { from: admin });
            });
            it("relay removed", async () => {
              assert.equal(await this.baseOperators.isRelay(relay), false);
            });
          });
        });
      });
    });
    context("managing multisig contract addresses", () => {
      describe("non-functional", () => {
        it("revert adding relay with zero addr", async () => {
          await expectRevert(this.baseOperators.addMultisig(ZERO_ADDRESS, { from: admin }), "BaseOperators: new multisig cannot be empty");
        });
      });
      describe("functional", () => {
        beforeEach(async () => {
          this.multisigMock = await MultisigMock.new({ from: admin });
        });
        describe("admin can add multisig", () => {
          beforeEach(async () => {
            await this.baseOperators.addMultisig(multisig, { from: admin });
          });
          it("multisig set", async () => {
            assert.equal(await this.baseOperators.isMultisig(multisig), true);
          });

          describe("multisig can change multisig to multisig contract", async () => {
            beforeEach(async () => {
              await this.baseOperators.changeMultisig(this.multisigMock.address, { from: admin });
            });
          });
          describe("non-functional", () => {
            describe("add multisig", () => {
              it("revert when multisig already assigned", async () => {
                await expectRevert(
                  this.baseOperators.addMultisig(multisig2, { from: admin }),
                  "BaseOperators: cannot assign new multisig when multisig already assigned"
                );
              });
            });
            describe("change multisig", () => {
              it("revert when caller is not multisig", async () => {
                await expectRevert(this.baseOperators.changeMultisig(multisig2, { from: admin }), "BaseOperators: caller does not have multisig role");
              });
              it("revert empty address change from multisig", async () => {
                await expectRevert(this.baseOperators.changeMultisig(ZERO_ADDRESS, { from: multisig }), "BaseOperators: new multisig cannot be empty");
              });
              describe("if admin first multisig, cannot send a non-contract to be new multisig", () => {
                it("revert non-contract change", async () => {
                  await expectRevert(this.baseOperators.changeMultisig(multisig2, { from: multisig }), "BaseOperators: multisig has to be contract");
                });
              });
            });
          });
        });
      });
    });
    context("changing baseOperators contract address in operatorable instance", () => {
      beforeEach(async () => {
        this.baseOperatorsNew = await BaseOperators.new(admin, { from: owner });
      });
      describe("non-functional", () => {
        it("revert attacker init changing", async () => {
          await expectRevert(
            this.operatorable.setOperatorsContract(this.baseOperatorsNew.address, { from: attacker }),
            "Operatorable: caller does not have the admin role"
          );
        });
        it("revert admin pass zero addr for new contract", async () => {
          await expectRevert(
            this.operatorable.setOperatorsContract(ZERO_ADDRESS, { from: admin }),
            "Operatorable: address of new operators contract can not be zero"
          );
        });
        it("revert baseOperators confirm for zero address", async () => {
          await expectRevert(this.operatorable.confirmOperatorsContract({ from: admin }), "Operatorable: address of new operators contract can not be zero");
        });
        it("revert admin finish second step passing broken contract address", async () => {
          // this.baseOperatorsNew = await BaseOperators.new(random, { from:owner })
          // await this.operatorable.setOperatorsContract(random, { from: admin })
          // assert.equal(await this.operatorable.getOperatorsPending(), random)
          // assert.equal(await this.operatorable.getOperatorsContract(), this.baseOperators.address)
          // await this.baseOperatorsNew.methods.confirmFor(this.operatorable.address).call({ from: admin })
          // assert.equal(await this.operatorable.getOperatorsContract(), this.baseOperators.address)
        });
      });
      context("two step logic for changing baseOperators contract address in operatorable instance", () => {
        beforeEach(async () => {
          await this.operatorable.setOperatorsContract(this.baseOperatorsNew.address, { from: admin });
        });
        describe("non-functional", () => {
          it("revert caller attacker", async () => {
            await expectRevert(
              this.baseOperatorsNew.confirmFor(this.operatorable.address, { from: attacker }),
              "BaseOperators: caller does not have the admin role"
            );
          });
          it("revert confirmation for zero addr", async () => {
            await expectRevert(this.baseOperatorsNew.confirmFor(ZERO_ADDRESS, { from: admin }), "BaseOperators: address cannot be empty");
          });
          it("revert confirmation if caller is not pending baseOperators contract address", async () => {
            await expectRevert(this.operatorable.confirmOperatorsContract({ from: admin }), "Operatorable: should be called from new operators contract");
          });
        });
        describe("functional", () => {
          it("check the new address of baseOperators contract is pending", async () => {
            assert.equal(await this.operatorable.getOperatorsPending(), this.baseOperatorsNew.address);
          });
          it("check current baseOperators contract is still old", async () => {
            assert.equal(await this.operatorable.getOperatorsContract(), this.baseOperators.address);
          });
          describe("success confirm", () => {
            beforeEach(async () => {
              await this.baseOperatorsNew.confirmFor(this.operatorable.address, { from: admin });
            });
            it("new contract applied", async () => {
              assert.equal(await this.operatorable.getOperatorsContract(), this.baseOperatorsNew.address);
            });
          });
          describe("change baseOperators contract second time", () => {
            beforeEach(async () => {
              await this.baseOperatorsNew.confirmFor(this.operatorable.address, { from: admin });
            });
            it("check pending, confirm and final setting new one baseOperators contract", async () => {
              this.operatorsNew1 = await BaseOperators.new(admin, { from: owner });
              await this.operatorable.setOperatorsContract(this.operatorsNew1.address, { from: admin });
              assert.equal(await this.operatorable.getOperatorsPending(), this.operatorsNew1.address);
              assert.equal(await this.operatorable.getOperatorsContract(), this.baseOperatorsNew.address);
              await this.operatorsNew1.confirmFor(this.operatorable.address, { from: admin });
              assert.equal(await this.operatorable.getOperatorsContract(), this.operatorsNew1.address);
            });
          });
        });
      });
    });
  });
});
