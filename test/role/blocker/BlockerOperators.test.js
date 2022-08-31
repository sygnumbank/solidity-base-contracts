require("chai").should();

const { expectRevert, BlockerOperatorable, BlockerOperators, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("BlockerOperators", ([admin, operator, blocker, relay, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.blockerOperatorable = await BlockerOperatorable.new({ from: admin });
  });

  context("contract initialization", () => {
    it("revert blockerOperators initialization with zero address", async () => {
      await expectRevert(this.blockerOperators.initialize(ZERO_ADDRESS, { from: operator }), "OperatorableNewOperatorsZeroAddress()");
    });
  });

  context("initialized successfully", () => {
    beforeEach(async () => {
      await this.blockerOperators.initialize(this.baseOperators.address);
      await this.baseOperators.addOperator(operator, { from: admin });
      await this.baseOperators.addRelay(relay, { from: admin });
    });
    describe("non-functional", () => {
      describe("from operator", () => {
        it("revert removing non-existing blocker", async () => {
          await expectRevert(this.blockerOperators.removeBlocker(blocker, { from: operator }), `RolesAccountDoesNotHaveRole("${blocker}")`);
        });
        it("revert removing blocker with zero addr", async () => {
          await expectRevert(this.blockerOperators.removeBlocker(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
        });
        it("revert adding blocker with zero addr", async () => {
          await expectRevert(this.blockerOperators.addBlocker(ZERO_ADDRESS, { from: operator }), "RolesAccountIsZeroAddress()");
        });
      });
      describe("from attacker", () => {
        it("revert adding blocker", async () => {
          await expectRevert(this.blockerOperators.addBlocker(blocker, { from: attacker }), "OperatorableCallerNotOperatorOrAdminOrRelay()");
        });
        describe("revert removing blocker", () => {
          beforeEach(async () => {
            await this.blockerOperators.addBlocker(blocker, { from: operator });
          });
          it("reverts", async () => {
            await expectRevert(this.blockerOperators.removeBlocker(blocker, { from: attacker }), "OperatorableCallerNotOperatorOrAdminOrRelay()");
          });
        });
      });
    });
    describe("functional", () => {
      describe("from operator", () => {
        describe("can add blocker", () => {
          beforeEach(async () => {
            await this.blockerOperators.addBlocker(blocker, { from: operator });
          });
          it("succesfully added", async () => {
            assert.equal(await this.blockerOperators.isBlocker(blocker), true);
          });
          describe("can remove blocker", () => {
            beforeEach(async () => {
              await this.blockerOperators.removeBlocker(blocker, { from: operator });
            });
            it("succesfully removed", async () => {
              assert.equal(await this.blockerOperators.isBlocker(blocker), false);
            });
          });
        });
      });
      describe("from relay", () => {
        describe("can add blocker", () => {
          beforeEach(async () => {
            await this.blockerOperators.addBlocker(blocker, { from: relay });
          });
          it("succesfully added", async () => {
            assert.equal(await this.blockerOperators.isBlocker(blocker), true);
          });
          describe("can remove blocker", () => {
            beforeEach(async () => {
              await this.blockerOperators.removeBlocker(blocker, { from: relay });
            });
            it("succesfully removed", async () => {
              assert.equal(await this.blockerOperators.isBlocker(blocker), false);
            });
          });
        });
      });
      describe("from admin", () => {
        describe("can add blocker", () => {
          beforeEach(async () => {
            await this.blockerOperators.addBlocker(blocker, { from: admin });
          });
          it("succesfully added", async () => {
            assert.equal(await this.blockerOperators.isBlocker(blocker), true);
          });
          describe("can remove blocker", () => {
            beforeEach(async () => {
              await this.blockerOperators.removeBlocker(blocker, { from: admin });
            });
            it("succesfully removed", async () => {
              assert.equal(await this.blockerOperators.isBlocker(blocker), false);
            });
          });
        });
      });
    });
  });
});
