require("chai").should();

const { expectRevert, RaiseOperatorable, RaiseOperators, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("RaiseOperators", ([admin, operator, investor, issuer, relay, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.raiseOperators = await RaiseOperators.new({ from: admin });
    this.raiseOperatorable = await RaiseOperatorable.new({ from: admin });
  });

  context("initialization", () => {
    it("revert raiseOperators initialization with zero address", async () => {
      await expectRevert(this.raiseOperators.initialize(ZERO_ADDRESS), "OperatorableNewOperatorsZeroAddress()");
    });
    it("revert RaiseOperatorable initialization with zero address", async () => {
      await expectRevert(this.raiseOperatorable.initialize(this.baseOperators.address, ZERO_ADDRESS), "RaiseOperatorableNewRaiseOperatorsAddressZero()");
    });
  });

  context("raiseOperatorable initialized", () => {
    beforeEach(async () => {
      await this.raiseOperatorable.initialize(this.baseOperators.address, this.raiseOperators.address);
    });
    describe("correctly pointing to baseOperators", () => {
      it("admin set", async () => {
        assert.equal(await this.raiseOperatorable.isAdmin(admin), true);
      });
    });

    describe("initial operatorable setup", () => {
      it("check isInitialized", async () => {
        assert.equal(await this.raiseOperatorable.isInitialized(), true);
      });
      it("can not be initialized twice", async () => {
        await expectRevert(this.raiseOperatorable.initialize(this.raiseOperators.address), "InitializableContractAlreadyInitialized()");
      });
    });
  });

  context("initialized succesfully", () => {
    beforeEach(async () => {
      await this.raiseOperators.initialize(this.baseOperators.address);
      await this.baseOperators.addOperator(operator, { from: admin });
      await this.baseOperators.addRelay(relay, { from: admin });
    });
    context("managing investor", () => {
      describe("non-functional", () => {
        describe("from operator", () => {
          it("revert removing non-existing investor", async () => {
            await expectRevert(this.raiseOperators.removeInvestor(investor, { from: operator }), `RolesAccountDoesNotHaveRole("${investor}")`);
          });
          it("revert removing investor with zero addr", async () => {
            await expectRevert(this.raiseOperators.removeInvestor(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
          });
          it("revert adding investor with zero addr", async () => {
            await expectRevert(this.raiseOperators.addInvestor(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
          });
        });
        describe("from attacker", () => {
          it("revert add investor", async () => {
            await expectRevert(this.raiseOperators.addInvestor(ZERO_ADDRESS, { from: attacker }), "OperatorableCallerNotOperatorOrRelay()");
          });
          describe("removal of investor", () => {
            beforeEach(async () => {
              await this.raiseOperators.addInvestor(investor, { from: operator });
            });
            it("revert remove investor", async () => {
              await expectRevert(this.raiseOperators.removeInvestor(ZERO_ADDRESS, { from: attacker }), "OperatorableCallerNotOperatorOrRelay()");
            });
          });
        });
      });
      describe("functional", () => {
        describe("from operator", () => {
          describe("can add investor", () => {
            beforeEach(async () => {
              await this.raiseOperators.addInvestor(investor, { from: operator });
            });
            it("investor added", async () => {
              assert.equal(await this.raiseOperators.isInvestor(investor), true);
            });
            describe("can remove investor", () => {
              beforeEach(async () => {
                await this.raiseOperators.removeInvestor(investor, { from: operator });
              });
              it("investor removed", async () => {
                assert.equal(await this.raiseOperators.isInvestor(investor), false);
              });
            });
          });
        });
        describe("from relay", () => {
          describe("can add investor", () => {
            beforeEach(async () => {
              await this.raiseOperators.addInvestor(investor, { from: relay });
            });
            it("investor added", async () => {
              assert.equal(await this.raiseOperators.isInvestor(investor), true);
            });
            describe("can remove investor", () => {
              beforeEach(async () => {
                await this.raiseOperators.removeInvestor(investor, { from: relay });
              });
              it("investor removed", async () => {
                assert.equal(await this.raiseOperators.isInvestor(investor), false);
              });
            });
          });
        });
      });
      context("managing issuer", () => {
        describe("non-functional", () => {
          describe("from operator", () => {
            it("revert removing non-existing issuer", async () => {
              await expectRevert(this.raiseOperators.removeIssuer(issuer, { from: operator }), `RolesAccountDoesNotHaveRole("${issuer}")`);
            });
            it("revert removing issuer with zero addr", async () => {
              await expectRevert(this.raiseOperators.removeIssuer(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
            });
            it("revert adding issuer with zero addr", async () => {
              await expectRevert(this.raiseOperators.addIssuer(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
            });
          });
          describe("from attacker", () => {
            it("revert add issuer", async () => {
              await expectRevert(this.raiseOperators.removeIssuer(issuer, { from: attacker }), "OperatorableCallerNotOperator()");
            });

            describe("removal of issuer", () => {
              beforeEach(async () => {
                await this.raiseOperators.addIssuer(issuer, { from: operator });
              });
              it("revert remove issuer", async () => {
                await expectRevert(this.raiseOperators.removeIssuer(ZERO_ADDRESS, { from: attacker }), "OperatorableCallerNotOperator()");
              });
            });
          });
        });
        describe("functional", () => {
          describe("from operator", () => {
            describe("can add issuer", () => {
              beforeEach(async () => {
                await this.raiseOperators.addIssuer(issuer, { from: operator });
              });
              it("investor added", async () => {
                assert.equal(await this.raiseOperators.isIssuer(issuer), true);
              });
              describe("can remove investor", () => {
                beforeEach(async () => {
                  await this.raiseOperators.removeIssuer(issuer, { from: operator });
                });
                it("investor removed", async () => {
                  assert.equal(await this.raiseOperators.isIssuer(issuer), false);
                });
              });
            });
          });
        });
      });
    });
  });
});
