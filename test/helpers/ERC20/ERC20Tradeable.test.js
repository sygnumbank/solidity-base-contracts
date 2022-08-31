const { expectRevert, BaseOperators, TraderOperators, ERC20TradeableMock, MINT, APPROVAL } = require("../../common");

contract("ERC20Tradeable", ([admin, trader, user, spender, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });
    this.mock = await ERC20TradeableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      describe("trader operators", () => {
        beforeEach(async () => {
          await this.traderOperators.initialize(this.baseOperators.address);
        });
        describe("tradeable mock", () => {
          beforeEach(async () => {
            await this.mock.initialize(this.baseOperators.address, this.traderOperators.address);
          });
          describe("roles assigned", () => {
            describe("trader", () => {
              beforeEach(async () => {
                await this.traderOperators.addTrader(trader, { from: admin });
              });
              it("trader role assigned", async () => {
                assert.equal(await this.traderOperators.isTrader(trader), true);
              });
              describe("user balance mint", () => {
                beforeEach(async () => {
                  await this.mock.mint(user, MINT);
                });
                it("balance updated", async () => {
                  assert.equal(await this.mock.balanceOf(user), MINT);
                });
                describe("block", () => {
                  describe("non-functional", () => {
                    describe("from attacker", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.approveOnBehalf(user, spender, APPROVAL, { from: attacker }), "TraderOperatorableCallerNotTrader()");
                      });
                      it("balance not updated", async () => {
                        assert.equal(await this.mock.balanceOf(user), MINT);
                      });
                    });
                  });
                  describe("functional", () => {
                    describe("from operator", () => {
                      beforeEach(async () => {
                        await this.mock.approveOnBehalf(user, spender, APPROVAL, { from: trader });
                      });
                      it("balance remains consistent", async () => {
                        assert.equal(await this.mock.balanceOf(user), MINT);
                      });
                      it("allowance updated", async () => {
                        assert.equal(await this.mock.allowance(user, spender), APPROVAL);
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
});
