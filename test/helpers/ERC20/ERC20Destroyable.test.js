const { expectRevert, expectEvent, BaseOperators, ERC20Destroyable } = require("../../common");

contract("ERC20Destroyable", ([admin, operator, user, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await ERC20Destroyable.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      describe("destroyable mock", () => {
        beforeEach(async () => {
          await this.mock.initialize(this.baseOperators.address);
        });
        describe("roles assigned", () => {
          describe("operator", () => {
            beforeEach(async () => {
              await this.baseOperators.addOperator(operator, { from: admin });
            });
            it("operator role assigned", async () => {
              assert.equal(await this.baseOperators.isOperator(operator), true);
            });
            describe("destroy", () => {
              describe("non-functional", () => {
                it("from attacker", async () => {
                  await expectRevert(this.mock.destroy(user, { from: attacker }), "OperatorableCallerNotOperator()");
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  ({ logs: this.logs } = await this.mock.destroy(user, { from: operator }));
                  expectEvent.inTransaction(this.logs, this.mock, "Destroyed", { caller: operator, account: user, contractAddress: this.mock.address });
                });
              });
            });
          });
        });
      });
    });
  });
});
