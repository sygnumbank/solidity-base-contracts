require("chai").should();

const { expectRevert, RaiseOperatorable, RaiseOperators, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("RaiseOperatorable", ([owner, admin, attacker]) => {
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

  context("changing raiseOperators contract address in raiseOperatorable instance", () => {
    beforeEach(async () => {
      this.raiseOperatorsNew = await RaiseOperators.new({ from: admin });
      await this.raiseOperatorable.initialize(this.baseOperators.address, this.raiseOperators.address);
    });
    describe("non-functional", () => {
      it("revert attacker init changing", async () => {
        await expectRevert(
          this.raiseOperatorable.setRaiseOperatorsContract(this.raiseOperatorsNew.address, { from: attacker }),
          "OperatorableCallerNotAdmin()"
        );
      });
      it("revert admin pass zero addr for new contract", async () => {
        await expectRevert(this.raiseOperatorable.setRaiseOperatorsContract(ZERO_ADDRESS, { from: admin }), "RaiseOperatorableNewRaiseOperatorsAddressZero()");
      });
      it("revert raiseOperators confirm for zero address", async () => {
        await expectRevert(this.raiseOperatorable.setRaiseOperatorsContract(ZERO_ADDRESS, { from: admin }), "RaiseOperatorableNewRaiseOperatorsAddressZero()");
      });
    });
    context("two step logic for changing baseOperators contract address in raiseOperatorable instance", () => {
      describe("when pending contract not set", () => {
        it("revert confirm", async () => {
          await expectRevert(this.raiseOperatorable.confirmRaiseOperatorsContract({ from: admin }), "RaiseOperatorableNewRaiseOperatorsAddressZero()");
        });
      });
      describe("when pending contract set", () => {
        beforeEach(async () => {
          await this.raiseOperatorable.setRaiseOperatorsContract(this.raiseOperatorsNew.address, { from: admin });
          await this.raiseOperatorsNew.initialize(this.baseOperators.address);
        });
        describe("non-functional", () => {
          it("revert caller not admin - he can not confirm (the second step)", async () => {
            await expectRevert(this.raiseOperatorsNew.confirmFor(this.raiseOperatorable.address, { from: attacker }), "OperatorableCallerNotAdmin()");
          });
          it("revert confirmation if caller is not pending raiseOperators contract address", async () => {
            await expectRevert(this.raiseOperatorable.confirmRaiseOperatorsContract({ from: admin }), "RaiseOperatorableCallerNotNewRaiseOperator()");
          });

          describe("broken contract address", () => {
            it("revert admin finishing second step - @TODO does not give correct revert code ", async () => {
              // expectRevert(await this.raiseOperators.confirmFor(this.raiseOperatorable.address, { from: admin }), 'RaiseOperators: pending address incorrect')
            });
          });
        });
        describe("functional", () => {
          it("new address pending", async () => {
            assert.equal(await this.raiseOperatorable.getRaiseOperatorsPending(), this.raiseOperatorsNew.address);
          });
          it("current instance correct", async () => {
            assert.equal(await this.raiseOperatorable.getRaiseOperatorsContract(), this.raiseOperators.address);
          });
          it("successful change applied - race condition", async () => {
            await this.raiseOperatorsNew.confirmFor(this.raiseOperatorable.address, { from: admin });
          });
          describe("change baseOperators contract second time", async () => {
            beforeEach(async () => {
              await this.raiseOperatorsNew.confirmFor(this.raiseOperatorable.address, { from: admin });
            });
            it("check pending, confirm and final setting new one baseOperators contract", async () => {
              this.raiseOperatorsNew1 = await RaiseOperators.new({ from: owner });
              await this.raiseOperatorsNew1.initialize(this.baseOperators.address);

              await this.raiseOperatorable.setRaiseOperatorsContract(this.raiseOperatorsNew1.address, { from: admin });

              assert.equal(await this.raiseOperatorable.getRaiseOperatorsPending(), this.raiseOperatorsNew1.address);
              assert.equal(await this.raiseOperatorable.getRaiseOperatorsContract(), this.raiseOperatorsNew.address);

              await this.raiseOperatorsNew1.confirmFor(this.raiseOperatorable.address, { from: admin });
              assert.equal(await this.raiseOperatorable.getRaiseOperatorsContract(), this.raiseOperatorsNew1.address);
            });
          });
        });
      });
    });
  });
});
