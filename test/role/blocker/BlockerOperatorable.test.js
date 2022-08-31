require("chai").should();

const { expectRevert, BlockerOperatorable, BlockerOperators, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("BlockerOperatorable", ([owner, admin, operator, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.blockerOperatorable = await BlockerOperatorable.new({ from: admin });
  });

  context("intiialization", () => {
    describe("non-functional", () => {
      it("revert blockerOperatorable initialization with zero address", async () => {
        await expectRevert(
          this.blockerOperatorable.initialize(this.baseOperators.address, ZERO_ADDRESS, { from: operator }),
          "BlockerOperatorableNewBlockerOperatorsAddressZero()"
        );
      });
    });
    describe("functional", () => {
      beforeEach(async () => {
        await this.blockerOperatorable.initialize(this.baseOperators.address, this.blockerOperators.address);
      });
      describe("correctly pointing to baseOperators", () => {
        it("admin set", async () => {
          assert.equal(await this.blockerOperatorable.isAdmin(admin), true);
        });
      });
      describe("initial  setup", () => {
        it("check isInitialized", async () => {
          assert.equal(await this.blockerOperatorable.isInitialized(), true);
        });
        describe("non-functional", () => {
          it("can not be initialized twice", async () => {
            await expectRevert(this.blockerOperatorable.initialize(this.blockerOperators.address), "InitializableContractAlreadyInitialized()");
          });
        });
      });
    });
  });

  context("changing blockerOperators contract address in blockerOperatorable instance", () => {
    beforeEach(async () => {
      this.blockerOperatorsNew = await BlockerOperators.new({ from: admin });
      await this.blockerOperatorable.initialize(this.baseOperators.address, this.blockerOperators.address);
    });
    describe("non-functional", () => {
      it("revert attacker init changing", async () => {
        await expectRevert(
          this.blockerOperatorable.setBlockerOperatorsContract(this.blockerOperatorsNew.address, { from: attacker }),
          "OperatorableCallerNotAdmin()"
        );
      });
      it("revert admin pass zero addr for new contract", async () => {
        await expectRevert(
          this.blockerOperatorable.setBlockerOperatorsContract(ZERO_ADDRESS, { from: admin }),
          "BlockerOperatorableNewBlockerOperatorsAddressZero()"
        );
      });
      it("revert blockerOperators confirm for zero address", async () => {
        await expectRevert(
          this.blockerOperatorable.setBlockerOperatorsContract(ZERO_ADDRESS, { from: admin }),
          "BlockerOperatorableNewBlockerOperatorsAddressZero()"
        );
      });
    });

    context("two step logic for changing baseOperators contract address in BlockerOperatorable instance", () => {
      describe("when pending contract not set", () => {
        it("revert confirm", async () => {
          await expectRevert(
            this.blockerOperatorable.confirmBlockerOperatorsContract({ from: admin }),
            "BlockerOperatorablePendingBlockerOperatorsAddressZero()"
          );
        });
      });
      describe("when pending contract set", () => {
        beforeEach(async () => {
          await this.blockerOperatorable.setBlockerOperatorsContract(this.blockerOperatorsNew.address, { from: admin });
          await this.blockerOperatorsNew.initialize(this.baseOperators.address);
        });
        describe("non-functional", () => {
          it("revert caller not admin - he can not confirm (the second step)", async () => {
            await expectRevert(this.blockerOperatorsNew.confirmFor(this.blockerOperatorable.address, { from: attacker }), "OperatorableCallerNotAdmin()");
          });
          it("revert confirmation if caller is not pending blockerOperators contract address", async () => {
            await expectRevert(this.blockerOperatorable.confirmBlockerOperatorsContract({ from: admin }), "BlockerOperatorableCallerNotNewBlockerOperator()");
          });

          describe("broken contract address", () => {
            it("revert admin finishing second step - @TODO does not give correct revert code ", async () => {
              // expectRevert(await this.blockerOperators.confirmFor(this.blockerOperatorable.address, { from: admin }), 'BlockerOperators: pending address incorrect')
            });
          });
        });
        describe("functional", () => {
          it("new address pending", async () => {
            assert.equal(await this.blockerOperatorable.getBlockerOperatorsPending(), this.blockerOperatorsNew.address);
          });
          it("current instance correct", async () => {
            assert.equal(await this.blockerOperatorable.getBlockerOperatorsContract(), this.blockerOperators.address);
          });
          it("successful change applied - race condition", async () => {
            await this.blockerOperatorsNew.confirmFor(this.blockerOperatorable.address, { from: admin });
          });
          describe("change baseOperators contract second time", async () => {
            beforeEach(async () => {
              await this.blockerOperatorsNew.confirmFor(this.blockerOperatorable.address, { from: admin });
            });
            it("check pending, confirm and final setting new one baseOperators contract", async () => {
              this.blockerOperatorsNew1 = await BlockerOperators.new({ from: owner });
              await this.blockerOperatorsNew1.initialize(this.baseOperators.address);

              await this.blockerOperatorable.setBlockerOperatorsContract(this.blockerOperatorsNew1.address, { from: admin });

              assert.equal(await this.blockerOperatorable.getBlockerOperatorsPending(), this.blockerOperatorsNew1.address);
              assert.equal(await this.blockerOperatorable.getBlockerOperatorsContract(), this.blockerOperatorsNew.address);

              await this.blockerOperatorsNew1.confirmFor(this.blockerOperatorable.address, { from: admin });
              assert.equal(await this.blockerOperatorable.getBlockerOperatorsContract(), this.blockerOperatorsNew1.address);
            });
          });
        });
      });
    });
  });
});
