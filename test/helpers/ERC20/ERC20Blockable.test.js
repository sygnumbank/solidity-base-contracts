const { expectRevert, BaseOperators, BlockerOperators, ERC20BlockableMock, MINT, BLOCK } = require("../../common");

contract("ERC20Blockable", ([admin, operator, blocker, attacker, user]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.mock = await ERC20BlockableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      describe("blocker operators", () => {
        beforeEach(async () => {
          await this.blockerOperators.initialize(this.baseOperators.address);
        });
        describe("blockable mock", () => {
          beforeEach(async () => {
            await this.mock.initialize(this.baseOperators.address, this.blockerOperators.address);
          });
          describe("roles assigned", () => {
            describe("operator", () => {
              beforeEach(async () => {
                await this.baseOperators.addOperator(operator, { from: admin });
              });
              describe("blocker", () => {
                beforeEach(async () => {
                  await this.blockerOperators.addBlocker(blocker, { from: operator });
                });
                it("blocker role assigned", async () => {
                  assert.equal(await this.blockerOperators.isBlocker(blocker), true);
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
                          await expectRevert(this.mock.block(user, BLOCK, { from: attacker }), "BlockerOperatorable: caller is not blocker or operator role");
                        });
                        it("balance not updated", async () => {
                          assert.equal(await this.mock.balanceOf(user), MINT);
                        });
                      });
                    });
                    describe("functional", () => {
                      describe("from operator", () => {
                        beforeEach(async () => {
                          await this.mock.block(user, BLOCK, { from: operator });
                        });
                        it("balance updated", async () => {
                          assert.equal(await this.mock.balanceOf(user), MINT - BLOCK);
                        });
                        it("blocked balance updated", async () => {
                          assert.equal(await this.mock.blockedBalanceOf(user), BLOCK);
                        });
                        it("total blocked balance updated", async () => {
                          assert.equal(await this.mock.totalBlockedBalance(), BLOCK);
                        });
                      });
                      describe("from blocker", () => {
                        beforeEach(async () => {
                          await this.mock.block(user, BLOCK, { from: blocker });
                        });
                        it("balance updated", async () => {
                          assert.equal(await this.mock.balanceOf(user), MINT - BLOCK);
                        });
                        it("blocked balance updated", async () => {
                          assert.equal(await this.mock.blockedBalanceOf(user), BLOCK);
                        });
                        it("total blocked balance updated", async () => {
                          assert.equal(await this.mock.getTotalBlockedBalance(), BLOCK);
                        });
                        context("unblock", () => {
                          describe("non-functional", () => {
                            describe("from attacker", () => {
                              beforeEach(async () => {
                                await expectRevert(
                                  this.mock.unblock(user, BLOCK, { from: attacker }),
                                  "BlockerOperatorable: caller is not blocker or operator role"
                                );
                              });
                              it("blocked balance not updated", async () => {
                                assert.equal(await this.mock.blockedBalanceOf(user), BLOCK);
                              });
                            });
                            describe("functional", () => {
                              describe("from operator", () => {
                                beforeEach(async () => {
                                  await this.mock.unblock(user, BLOCK, { from: operator });
                                });
                                it("balance updated", async () => {
                                  assert.equal(await this.mock.balanceOf(user), MINT);
                                });
                                it("blocked balance updated", async () => {
                                  assert.equal(await this.mock.blockedBalanceOf(user), BLOCK - BLOCK);
                                });
                                it("total blocked balance updated", async () => {
                                  assert.equal(await this.mock.totalBlockedBalance(), BLOCK - BLOCK);
                                });
                              });
                              describe("from blocker", () => {
                                beforeEach(async () => {
                                  await this.mock.unblock(user, BLOCK, { from: blocker });
                                });
                                it("balance updated", async () => {
                                  assert.equal(await this.mock.balanceOf(user), MINT);
                                });
                                it("blocked balance updated", async () => {
                                  assert.equal(await this.mock.blockedBalanceOf(user), BLOCK - BLOCK);
                                });
                                it("total blocked balance updated", async () => {
                                  assert.equal(await this.mock.getTotalBlockedBalance(), BLOCK - BLOCK);
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
        });
      });
    });
  });
});
