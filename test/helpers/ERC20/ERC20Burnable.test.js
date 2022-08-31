const { expectRevert, BaseOperators, ERC20BurnableMock, MINT, BURN } = require("../../common");

contract("ERC20Burnable", ([admin, operator, attacker, user]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await ERC20BurnableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      beforeEach(async () => {
        await this.mock.initialize(this.baseOperators.address);
      });
      describe("roles assigned", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
        });
        describe("user balance mint", () => {
          beforeEach(async () => {
            await this.mock.mint(user, MINT);
          });
          it("balance updated", async () => {
            assert.equal(await this.mock.balanceOf(user), MINT);
          });
          describe("burn for", () => {
            describe("non-functional", () => {
              describe("from attacker", () => {
                beforeEach(async () => {
                  await expectRevert(this.mock.burnFor(user, BURN, { from: attacker }), "OperatorableCallerNotOperator()");
                });
                it("balance not updated", async () => {
                  assert.equal(await this.mock.balanceOf(user), MINT);
                });
              });
            });
            describe("functional", () => {
              describe("from operator", () => {
                beforeEach(async () => {
                  await this.mock.burnFor(user, BURN, { from: operator });
                });
                it("balance updated", async () => {
                  assert.equal(await this.mock.balanceOf(user), MINT - BURN);
                });
              });
            });
          });
        });
      });
    });
  });
});
