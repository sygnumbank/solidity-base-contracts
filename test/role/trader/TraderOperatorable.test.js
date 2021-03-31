require("chai").should();

const { expectRevert, TraderOperators, TraderOperatorable, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("TraderOperatorable", ([owner, admin, operator, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.traderOperators = await TraderOperators.new({ from: admin });
    this.traderOperatorable = await TraderOperatorable.new({ from: admin });
  });

  context("intiialization", () => {
    describe("non-functional", () => {
      it("revert traderOperatorable initialization with zero address", async () => {
        await expectRevert(
          this.traderOperatorable.initialize(this.baseOperators.address, ZERO_ADDRESS, { from: admin }),
          "TraderOperatorable: address of new traderOperators contract can not be zero"
        );
      });
    });
    describe("functional", () => {
      beforeEach(async () => {
        await this.traderOperatorable.initialize(this.baseOperators.address, this.traderOperators.address);
      });
      describe("correctly pointing to baseOperators", () => {
        it("admin set", async () => {
          assert.equal(await this.traderOperatorable.isAdmin(admin), true);
        });
      });

      describe("initial  setup", () => {
        it("check isInitialized", async () => {
          assert.equal(await this.traderOperatorable.isInitialized(), true);
        });
        describe("non-functional", () => {
          it("can not be initialized twice", async () => {
            await expectRevert(
              this.traderOperatorable.initialize(this.traderOperators.address),
              "Initializable: Contract instance has already been initialized"
            );
          });
        });
      });
    });
  });

  context("changing traderOperators contract address in traderOperatorable instance", () => {
    beforeEach(async () => {
      this.traderOperatorsNew = await TraderOperators.new({ from: admin });
      await this.traderOperatorable.initialize(this.baseOperators.address, this.traderOperators.address);
    });
    describe("non-functional", () => {
      it("revert attacker init changing", async () => {
        await expectRevert(
          this.traderOperatorable.setTraderOperatorsContract(this.traderOperatorsNew.address, { from: attacker }),
          "Operatorable: caller does not have the admin role"
        );
      });
      it("revert admin pass zero addr for new contract", async () => {
        await expectRevert(
          this.traderOperatorable.setTraderOperatorsContract(ZERO_ADDRESS, { from: admin }),
          "TraderOperatorable: address of new traderOperators contract can not be zero"
        );
      });
      it("revert traderOperators confirm for zero address", async () => {
        await expectRevert(
          this.traderOperatorable.setTraderOperatorsContract(ZERO_ADDRESS, { from: admin }),
          "TraderOperatorable: address of new traderOperators contract can not be zero"
        );
      });
    });

    context("two step logic for changing baseOperators contract address in TraderOperatorable instance", () => {
      describe("when pending contract not set", () => {
        it("revert confirm", async () => {
          await expectRevert(
            this.traderOperatorable.confirmTraderOperatorsContract({ from: admin }),
            "TraderOperatorable: address of pending traderOperators contract can not be zero"
          );
        });
      });
      describe("when pending contract set", () => {
        beforeEach(async () => {
          await this.traderOperatorable.setTraderOperatorsContract(this.traderOperatorsNew.address, { from: admin });
          await this.traderOperatorsNew.initialize(this.baseOperators.address);
        });
        describe("non-functional", () => {
          it("revert caller not admin - he can not confirm (the second step)", async () => {
            await expectRevert(
              this.traderOperatorsNew.confirmFor(this.traderOperatorable.address, { from: attacker }),
              "Operatorable: caller does not have the admin role"
            );
          });
          it("revert confirmation if caller is not pending traderOperators contract address", async () => {
            await expectRevert(
              this.traderOperatorable.confirmTraderOperatorsContract({ from: admin }),
              "TraderOperatorable: should be called from new traderOperators contract"
            );
          });

          describe("broken contract address", () => {
            it("revert admin finishing second step - @TODO does not give correct revert code ", async () => {
              // expectRevert(await this.traderOperators.confirmFor(this.traderOperatorable.address, { from: admin }), 'TraderOperators: pending address incorrect')
            });
          });
        });
        describe("functional", () => {
          it("new address pending", async () => {
            assert.equal(await this.traderOperatorable.getTraderOperatorsPending(), this.traderOperatorsNew.address);
          });
          it("current instance correct", async () => {
            assert.equal(await this.traderOperatorable.getTraderOperatorsContract(), this.traderOperators.address);
          });
          it("successful change applied - race condition", async () => {
            await this.traderOperatorsNew.confirmFor(this.traderOperatorable.address, { from: admin });
          });
          describe("change baseOperators contract second time", async () => {
            beforeEach(async () => {
              await this.traderOperatorsNew.confirmFor(this.traderOperatorable.address, { from: admin });
            });
            it("check pending, confirm and final setting new one baseOperators contract", async () => {
              this.traderOperatorsNew1 = await TraderOperators.new({ from: owner });
              await this.traderOperatorsNew1.initialize(this.baseOperators.address);

              await this.traderOperatorable.setTraderOperatorsContract(this.traderOperatorsNew1.address, { from: admin });

              assert.equal(await this.traderOperatorable.getTraderOperatorsPending(), this.traderOperatorsNew1.address);
              assert.equal(await this.traderOperatorable.getTraderOperatorsContract(), this.traderOperatorsNew.address);

              await this.traderOperatorsNew1.confirmFor(this.traderOperatorable.address, { from: admin });
              assert.equal(await this.traderOperatorable.getTraderOperatorsContract(), this.traderOperatorsNew1.address);
            });
          });
        });
      });
    });
  });
});
