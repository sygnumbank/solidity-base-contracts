const { expectRevert, BaseOperators, TraderOperators, PausableMock } = require("../common");

contract("Pausable", ([admin, operator, trader, system, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });
    this.mock = await PausableMock.new({ from: admin });
  });
  describe("contract initialization", () => {
    describe("trader operators initializations", () => {
      beforeEach(async () => {
        await this.traderOperators.initialize(this.baseOperators.address);
      });
      it("contract set", async () => {
        assert.equal(await this.traderOperators.getOperatorsContract(), this.baseOperators.address);
      });
      describe("mock initialization", () => {
        beforeEach(async () => {
          await this.mock.initialize(this.baseOperators.address, this.traderOperators.address);
        });
        describe("base role initialization", () => {
          describe("set roles", () => {
            describe("operator", () => {
              beforeEach(async () => {
                await this.baseOperators.addOperator(operator, { from: admin });
              });
              it("operator set", async () => {
                assert.equal(await this.baseOperators.isOperator(operator), true);
              });
              describe("system", () => {
                beforeEach(async () => {
                  await this.baseOperators.addSystem(system, { from: admin });
                });
                it("system set", async () => {
                  assert.equal(await this.baseOperators.isSystem(system), true);
                });
                describe("trader", () => {
                  beforeEach(async () => {
                    await this.traderOperators.addTrader(trader, { from: admin });
                  });
                  it("trader set", async () => {
                    assert.equal(await this.traderOperators.isTrader(trader), true);
                  });
                  describe("non-functional", () => {
                    it("revert pause action when not paused from operator", async () => {
                      await expectRevert(this.mock.pausedAction({ from: operator }), "PausableNotPaused()");
                    });
                    it("revert pause action when not paused from system", async () => {
                      await expectRevert(this.mock.pausedAction({ from: system }), "PausableNotPaused()");
                    });
                    it("revert pause action when not paused from trader", async () => {
                      await expectRevert(this.mock.pausedAction({ from: trader }), "PausableNotPaused()");
                    });
                    it("revert pause from attacker", async () => {
                      await expectRevert(this.mock.pause({ from: attacker }), "TraderOperatorableCallerNotTraderOrOperatorOrSystem()");
                    });
                    describe("revert pausing if already paused", () => {
                      beforeEach(async () => {
                        await this.mock.pause({ from: operator });
                      });
                      it("revert re-pause", async () => {
                        await expectRevert(this.mock.pause({ from: operator }), "PausablePaused()");
                      });
                    });
                    describe("functional", () => {
                      describe("from operator", () => {
                        beforeEach(async () => {
                          await this.mock.pause({ from: operator });
                        });
                        it("paused set", async () => {
                          assert.equal(await this.mock.isPaused(), true);
                        });
                        describe("can execute paused action", () => {
                          beforeEach(async () => {
                            await this.mock.pausedAction({ from: operator });
                          });
                          it("paused action set", async () => {
                            assert.equal(await this.mock.PausedAction(), true);
                          });
                        });
                      });
                      describe("from system", () => {
                        beforeEach(async () => {
                          await this.mock.pause({ from: system });
                        });
                        it("paused set", async () => {
                          assert.equal(await this.mock.isPaused(), true);
                        });
                        describe("can execute paused action", () => {
                          beforeEach(async () => {
                            await this.mock.pausedAction({ from: system });
                          });
                          it("paused action set", async () => {
                            assert.equal(await this.mock.PausedAction(), true);
                          });
                        });
                      });
                      describe("from trader", () => {
                        beforeEach(async () => {
                          await this.mock.pause({ from: trader });
                        });
                        it("paused set", async () => {
                          assert.equal(await this.mock.isPaused(), true);
                        });
                        describe("can execute paused action", () => {
                          beforeEach(async () => {
                            await this.mock.pausedAction({ from: trader });
                          });
                          it("paused action set", async () => {
                            assert.equal(await this.mock.PausedAction(), true);
                          });
                        });
                        describe("unpausing", () => {
                          describe("non-functional", () => {
                            it("revert unpause action when not unpaused", async () => {
                              await expectRevert(this.mock.unpausedAction({ from: operator }), "PausablePaused()");
                            });
                            it("revert pause action when not paused from system", async () => {
                              await expectRevert(this.mock.unpausedAction({ from: system }), "PausablePaused()");
                            });
                            it("revert pause action when not paused from trader", async () => {
                              await expectRevert(this.mock.unpausedAction({ from: trader }), "PausablePaused()");
                            });
                            it("revert unpause from attacker", async () => {
                              await expectRevert(this.mock.unpause({ from: attacker }), "TraderOperatorableCallerNotTraderOrOperatorOrSystem()");
                            });
                            describe("revert unpause if not paused", () => {
                              beforeEach(async () => {
                                await this.mock.unpause({ from: operator });
                              });
                              it("revert re-pause", async () => {
                                await expectRevert(this.mock.unpause({ from: operator }), "PausableNotPaused()");
                              });
                            });
                          });
                          describe("functional", () => {
                            describe("from operator", () => {
                              beforeEach(async () => {
                                await this.mock.unpause({ from: operator });
                              });
                              it("paused set", async () => {
                                assert.equal(await this.mock.isPaused(), false);
                              });
                              describe("can execute paused action", () => {
                                beforeEach(async () => {
                                  await this.mock.unpausedAction({ from: operator });
                                });
                                it("paused action set", async () => {
                                  assert.equal(await this.mock.UnpausedAction(), true);
                                });
                              });
                            });
                            describe("from system", () => {
                              beforeEach(async () => {
                                await this.mock.unpause({ from: system });
                              });
                              it("paused set", async () => {
                                assert.equal(await this.mock.isPaused(), false);
                              });
                              describe("can execute paused action", () => {
                                beforeEach(async () => {
                                  await this.mock.unpausedAction({ from: system });
                                });
                                it("paused action set", async () => {
                                  assert.equal(await this.mock.UnpausedAction(), true);
                                });
                              });
                            });
                            describe("from trader", () => {
                              beforeEach(async () => {
                                await this.mock.unpause({ from: trader });
                              });
                              it("paused set", async () => {
                                assert.equal(await this.mock.isPaused(), false);
                              });
                              describe("can execute paused action", () => {
                                beforeEach(async () => {
                                  await this.mock.unpausedAction({ from: trader });
                                });
                                it("paused action set", async () => {
                                  assert.equal(await this.mock.UnpausedAction(), true);
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
