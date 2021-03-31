const { expectRevert, BaseOperators, FreezableMock, ZERO_ADDRESS, THREE_HUNDRED_ADDRESS, TWO_ADDRESSES } = require("../common");

contract("Freezable", ([admin, operator, system, user, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await FreezableMock.new({ from: admin });
  });
  describe("contract initialization", () => {
    beforeEach(async () => {
      await this.mock.initialize(this.baseOperators.address);
    });
    describe("base role initialization", () => {
      beforeEach(async () => {
        await this.baseOperators.addOperator(operator, { from: admin });
        await this.baseOperators.addSystem(system, { from: admin });
      });
      context("individual actions", () => {
        context("freeze", () => {
          describe("non-functional", () => {
            it("revert from attacker", async () => {
              await expectRevert(this.mock.toggleFreeze(user, true, { from: attacker }), "Operatorable: caller does not have the operator role");
            });
            it("revert empty address", async () => {
              await expectRevert(this.mock.toggleFreeze(ZERO_ADDRESS, true, { from: operator }), "Freezable: Empty address");
            });
            it("revert frozen action when unfrozen", async () => {
              await expectRevert(this.mock.frozenAction({ from: user }), "Freezable: account is not frozen");
            });
          });
          describe("functional", () => {
            beforeEach(async () => {
              await this.mock.toggleFreeze(user, true, { from: operator });
            });
            it("frozen set", async () => {
              assert.equal(await this.mock.isFrozen(user), true);
            });
            describe("frozen functionality", async () => {
              beforeEach(async () => {
                await this.mock.frozenAction({ from: user });
              });
              it("frozen action set", async () => {
                assert.equal(await this.mock.FrozenAction(), true);
              });
            });
            context("unfreeze", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(this.mock.toggleFreeze(user, false, { from: attacker }), "Operatorable: caller does not have the operator role");
                });
                it("revert empty address", async () => {
                  await expectRevert(this.mock.toggleFreeze(ZERO_ADDRESS, false, { from: operator }), "Freezable: Empty address");
                });
                it("revert unfrozen action when frozen", async () => {
                  await expectRevert(this.mock.unfrozenAction({ from: user }), "Freezable: account is frozen");
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.mock.toggleFreeze(user, false, { from: operator });
                });
                it("frozen unset", async () => {
                  assert.equal(await this.mock.isFrozen(user), false);
                });
                describe("non-frozen functionality", async () => {
                  beforeEach(async () => {
                    await this.mock.unfrozenAction({ from: user });
                  });
                  it("unfrozen action set", async () => {
                    assert.equal(await this.mock.UnfrozenAction(), true);
                  });
                });
              });
            });
          });
        });
      });
      context("batch actions", () => {
        describe("freeze", () => {
          describe("non-functional", () => {
            it("revert when batch greater than 256", async () => {
              await expectRevert(this.mock.batchToggleFreeze(THREE_HUNDRED_ADDRESS, true, { from: operator }), "Freezable: batch count is greater than 256");
            });
          });
          describe("functional", () => {
            beforeEach(async () => {
              await this.mock.batchToggleFreeze(TWO_ADDRESSES, true, { from: operator });
            });
            it("first address frozen", async () => {
              assert.equal(await this.mock.isFrozen(TWO_ADDRESSES[0]), true);
            });
            it("second address frozen", async () => {
              assert.equal(await this.mock.isFrozen(TWO_ADDRESSES[1]), true);
            });
            describe("unfreeze", () => {
              describe("non-functional", () => {
                it("revert when batch greater than 256", async () => {
                  await expectRevert(
                    this.mock.batchToggleFreeze(THREE_HUNDRED_ADDRESS, false, { from: operator }),
                    "Freezable: batch count is greater than 256"
                  );
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.mock.batchToggleFreeze(TWO_ADDRESSES, false, { from: operator });
                });
                it("first address unfrozen", async () => {
                  assert.equal(await this.mock.isFrozen(TWO_ADDRESSES[0]), false);
                });
                it("second address unfrozen", async () => {
                  assert.equal(await this.mock.isFrozen(TWO_ADDRESSES[1]), false);
                });
              });
            });
          });
        });
      });
    });
  });
});
