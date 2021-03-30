require("chai").should();

const { expectRevert, TraderOperators, TraderOperatorableMock, BaseOperators } = require("../../common");

contract("TraderOperatorableMock", ([admin, operator, trader, system, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    await this.baseOperators.addOperator(operator, { from: admin });

    this.traderOperators = await TraderOperators.new({ from: admin });
    await this.traderOperators.initialize(this.baseOperators.address);

    this.traderOperatorableMock = await TraderOperatorableMock.new({ from: admin });
    await this.traderOperatorableMock.setContract(this.baseOperators.address, this.traderOperators.address);
  });
  describe("trader action", () => {
    beforeEach(async () => {
      await this.traderOperators.addTrader(trader, { from: admin });
    });
    describe("non-functional", () => {
      it("reverts when not trader", async () => {
        await expectRevert(this.traderOperatorableMock.traderAction({ from: attacker }), "TraderOperatorable: caller is not trader");
      });
    });
    describe("functional", () => {
      describe("trader action", () => {
        describe("when trader", () => {
          beforeEach(async () => {
            await this.traderOperatorableMock.traderAction({ from: trader });
          });
          it("trader action set", async () => {
            assert.equal(await this.traderOperatorableMock.TraderAction(), true);
          });
        });
      });
      describe("operator or trader or system action", () => {
        describe("when trader", () => {
          beforeEach(async () => {
            await this.traderOperatorableMock.operatorOrTraderOrSystemAction({ from: trader });
          });
          it("operator or trader or system action set", async () => {
            assert.equal(await this.traderOperatorableMock.OperatorOrTraderOrSystemAction(), true);
          });
        });
        describe("when operator", () => {
          beforeEach(async () => {
            await this.traderOperatorableMock.operatorOrTraderOrSystemAction({ from: operator });
          });
          it("operator or trader or system action set", async () => {
            assert.equal(await this.traderOperatorableMock.OperatorOrTraderOrSystemAction(), true);
          });
        });
        describe("when system", () => {
          beforeEach(async () => {
            await this.baseOperators.addSystem(system, { from: admin });
          });
          describe("system set", () => {
            beforeEach(async () => {
              await this.traderOperatorableMock.operatorOrTraderOrSystemAction({ from: system });
            });
            it("operator or trader or system action set", async () => {
              assert.equal(await this.traderOperatorableMock.OperatorOrTraderOrSystemAction(), true);
            });
          });
        });
      });
    });
  });
});
