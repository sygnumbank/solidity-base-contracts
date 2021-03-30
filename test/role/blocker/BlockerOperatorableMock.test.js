require("chai").should();

const { expectRevert, expectEvent, BlockerOperators, BlockerOperatorableMock, BlockerContractMock, BaseOperators } = require("../../common");

contract("BlockerOperatorableMock", ([admin, operator, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    await this.baseOperators.addOperator(operator, { from: admin });

    this.blockerContractMock = await BlockerContractMock.new({ from: admin });

    this.blockerOperators = await BlockerOperators.new({ from: admin });
    await this.blockerOperators.initialize(this.baseOperators.address);

    await this.blockerOperators.addBlocker(this.blockerContractMock.address, { from: operator });

    this.blockerOperatorableMock = await BlockerOperatorableMock.new({ from: admin });
    await this.blockerOperatorableMock.setContract(this.baseOperators.address, this.blockerOperators.address);
  });
  describe("blocker action", () => {
    describe("non-functional", () => {
      it("reverts when not blocker", async () => {
        await expectRevert(this.blockerOperatorableMock.blockerAction({ from: attacker }), "BlockerOperatorable: caller is not blocker");
      });
    });
    describe("functional", () => {
      it("when blocker", async () => {
        const { tx } = await this.blockerContractMock.callBlocker(this.blockerOperatorableMock.address);
        expectEvent.inTransaction(tx, this.blockerOperatorableMock, "BlockerCalled", { caller: this.blockerContractMock.address, blockerAction: true });
      });
    });
  });
  describe("blocker or operator action", () => {
    describe("non-functional", () => {
      it("reverts when not blocker or operator", async () => {
        await expectRevert(this.blockerOperatorableMock.blockerOrOperatorAction({ from: attacker }), "BlockerOperatorable: caller is not blocker or operator");
      });
    });
    describe("functional", () => {
      describe("when operator", () => {
        beforeEach(async () => {
          await this.blockerOperatorableMock.blockerOrOperatorAction({ from: operator });
        });
        it("blocker or operator action set", async () => {
          assert.equal(await this.blockerOperatorableMock.BlockerOrOperatorAction(), true);
        });
      });
      it("when blocker", async () => {
        const { tx } = await this.blockerContractMock.callBlockerOrOperator(this.blockerOperatorableMock.address);
        expectEvent.inTransaction(tx, this.blockerOperatorableMock, "BlockerOrOperatorCalled", {
          caller: this.blockerContractMock.address,
          BlockerOrOperatorAction: true,
        });
      });
    });
  });
});
