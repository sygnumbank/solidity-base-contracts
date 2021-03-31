require("chai").should();

const { expectRevert, TraderOperatorable, TraderOperators, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("TraderOperators", ([admin, operator, trader, relay, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.traderOperators = await TraderOperators.new({ from: admin });
    this.traderOperatorable = await TraderOperatorable.new({ from: admin });
  });

  context("contract initialization", () => {
    it("revert traderOperators initialization with zero address", async () => {
      await expectRevert(this.traderOperators.initialize(ZERO_ADDRESS, { from: admin }), "Operatorable: address of new operators contract cannot be zero");
    });
  });

  context("initialized successfully", () => {
    beforeEach(async () => {
      await this.traderOperators.initialize(this.baseOperators.address);
      await this.baseOperators.addRelay(relay, { from: admin });
    });
    describe("non-functional", () => {
      describe("from operator", () => {
        it("revert removing non-existing trader", async () => {
          await expectRevert(this.traderOperators.removeTrader(trader, { from: admin }), "Roles: account does not have role");
        });
        it("revert removing trader with zero addr", async () => {
          await expectRevert(this.traderOperators.removeTrader(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
        it("revert adding trader with zero addr", async () => {
          await expectRevert(this.traderOperators.addTrader(ZERO_ADDRESS, { from: admin }), "Roles: account is the zero address");
        });
      });
      describe("from attacker", () => {
        it("revert adding trader", async () => {
          await expectRevert(this.traderOperators.addTrader(trader, { from: attacker }), "Operatorable: caller does not have the admin role nor relay");
        });
        describe("revert removing trader", () => {
          beforeEach(async () => {
            await this.traderOperators.addTrader(trader, { from: admin });
          });
          it("reverts", async () => {
            await expectRevert(this.traderOperators.removeTrader(trader, { from: attacker }), "Operatorable: caller does not have the admin role nor relay");
          });
        });
      });
    });
    describe("functional", () => {
      describe("from operator", () => {
        describe("can add trader", () => {
          beforeEach(async () => {
            await this.traderOperators.addTrader(trader, { from: admin });
          });
          it("succesfully added", async () => {
            assert.equal(await this.traderOperators.isTrader(trader), true);
          });
          describe("can remove trader", () => {
            beforeEach(async () => {
              await this.traderOperators.removeTrader(trader, { from: admin });
            });
            it("sucesfully removed", async () => {
              assert.equal(await this.traderOperators.isTrader(trader), false);
            });
          });
        });
      });
      describe("from operator", () => {
        describe("can add trader", () => {
          beforeEach(async () => {
            await this.traderOperators.addTrader(trader, { from: relay });
          });
          it("succesfully added", async () => {
            assert.equal(await this.traderOperators.isTrader(trader), true);
          });
          describe("can remove trader", () => {
            beforeEach(async () => {
              await this.traderOperators.removeTrader(trader, { from: relay });
            });
            it("sucesfully removed", async () => {
              assert.equal(await this.traderOperators.isTrader(trader), false);
            });
          });
        });
      });
    });
  });
});
