const {
  expectRevert,
  BaseOperators,
  TraderOperators,
  TradingPairWhitelistMock,
  ZERO_ADDRESS,
  THREE_HUNDRED_ADDRESS,
  TWO_ADDRESSES,
  TWO_IDENTIFIER,
} = require("../common");

contract("TradingPairWhitelist", ([admin, operator, system, trader, buyToken, sellToken, identifier, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });

    this.mock = await TradingPairWhitelistMock.new({ from: admin });
  });
  describe("contract initialization", () => {
    beforeEach(async () => {
      await this.traderOperators.initialize(this.baseOperators.address);
      await this.mock.initialize(this.baseOperators.address, this.traderOperators.address);
    });
    describe("base role initialization", () => {
      beforeEach(async () => {
        await this.baseOperators.addOperator(operator, { from: admin });
        await this.baseOperators.addSystem(system, { from: admin });
      });
      describe("trader role initialization", () => {
        beforeEach(async () => {
          await this.traderOperators.addTrader(trader, { from: admin });
        });
        context("pair tokens", () => {
          describe("non-functional", () => {
            it("revert when attacker", async () => {
              await expectRevert(
                this.mock.pairTokens(identifier, buyToken, sellToken, { from: attacker }),
                "Operatorable: caller does not have the operator role"
              );
            });
            it("revert when buy token empty", async () => {
              await expectRevert(this.mock.pairTokens(identifier, ZERO_ADDRESS, sellToken, { from: operator }), "TradingPairWhitelist: tokens cannot be empty");
            });
            it("revert when sell token empty", async () => {
              await expectRevert(this.mock.pairTokens(identifier, buyToken, ZERO_ADDRESS, { from: operator }), "TradingPairWhitelist: tokens cannot be empty");
            });
            it("revert when by and sell token are the same", async () => {
              await expectRevert(
                this.mock.pairTokens(identifier, buyToken, buyToken, { from: operator }),
                "TradingPairWhitelist: buy and sell tokens cannot be the same"
              );
            });
            it("revert onlyPaired functionality", async () => {
              await expectRevert(this.mock.pairedAction(buyToken, sellToken, { from: operator }), "TradingPairWhitelist: pair is not whitelisted");
            });
            describe("when already paired", () => {
              beforeEach(async () => {
                await this.mock.pairTokens(identifier, buyToken, sellToken, { from: operator });
              });
              it("revert when paired", async () => {
                await expectRevert(
                  this.mock.pairTokens(identifier, buyToken, sellToken, { from: operator }),
                  "TradingPairWhitelist: tokens have already been paired"
                );
              });
              it("when identifier already used", async () => {
                await expectRevert(
                  this.mock.pairTokens(identifier, THREE_HUNDRED_ADDRESS[0], THREE_HUNDRED_ADDRESS[1], { from: operator }),
                  "TradingPairWhitelist: pair ID exists"
                );
              });
            });
          });
          describe("functional", () => {
            beforeEach(async () => {
              await this.mock.pairTokens(identifier, buyToken, sellToken, { from: operator });
            });
            it("pair set", async () => {
              assert.equal(await this.mock.isPaired(buyToken, sellToken), true);
            });
            describe("onlyPaired functionality", () => {
              beforeEach(async () => {
                await this.mock.pairedAction(buyToken, sellToken, { from: operator });
              });
              it("paired action set", async () => {
                assert.equal(await this.mock.PairedAction(), true);
              });
            });
            describe("freeze pair", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(this.mock.freezePair(identifier, { from: attacker }), "TraderOperatorable: caller is not trader or operator or system");
                });
                describe("when already frozen", () => {
                  beforeEach(async () => {
                    await this.mock.freezePair(identifier, { from: operator });
                  });
                  it("revert when frozen", async () => {
                    await expectRevert(this.mock.freezePair(identifier, { from: operator }), "TradingPairWhitelist: token pair is frozen");
                  });
                });
                describe("when not paired", () => {
                  beforeEach(async () => {
                    await this.mock.depairTokens(identifier, { from: operator });
                  });
                  it("revert when not paired", async () => {
                    await expectRevert(this.mock.freezePair(identifier, { from: operator }), "TradingPairWhitelist: pair ID not does not exist");
                  });
                });
              });
              describe("functional", () => {
                describe("from operator", () => {
                  beforeEach(async () => {
                    await this.mock.freezePair(identifier, { from: operator });
                  });
                  it("pair is frozen", async () => {
                    assert.equal(await this.mock.isFrozen(buyToken, sellToken), true);
                  });
                });
                describe("from trader", () => {
                  beforeEach(async () => {
                    await this.mock.freezePair(identifier, { from: trader });
                  });
                  it("pair is frozen", async () => {
                    assert.equal(await this.mock.isFrozen(buyToken, sellToken), true);
                  });
                });
                describe("from system", () => {
                  beforeEach(async () => {
                    await this.mock.freezePair(identifier, { from: system });
                  });
                  it("pair is frozen", async () => {
                    assert.equal(await this.mock.isFrozen(buyToken, sellToken), true);
                  });
                });
                describe("un-freeze pair", () => {
                  beforeEach(async () => {
                    await this.mock.freezePair(identifier, { from: operator });
                  });
                  describe("non-functional", () => {
                    it("revert whenNotFrozen functionality", async () => {
                      await expectRevert(this.mock.whenNotFrozenAction(buyToken, sellToken, { from: operator }), "TradingPairWhitelist: pair is frozen");
                    });
                    describe("when not paired", () => {
                      beforeEach(async () => {
                        await this.mock.depairTokens(identifier, { from: operator });
                      });
                      it("revert when not paired", async () => {
                        await expectRevert(this.mock.unfreezePair(identifier, { from: operator }), "TradingPairWhitelist: pair ID not does not exist");
                      });
                    });
                    describe("when already un-frozen", () => {
                      beforeEach(async () => {
                        await this.mock.unfreezePair(identifier, { from: operator });
                      });
                      it("revert when frozen", async () => {
                        await expectRevert(this.mock.unfreezePair(identifier, { from: operator }), "TradingPairWhitelist: token pair is not frozen");
                      });
                    });
                  });
                  describe("functional", () => {
                    describe("from operator", () => {
                      beforeEach(async () => {
                        await this.mock.unfreezePair(identifier, { from: operator });
                      });
                      it("pair unfrozen", async () => {
                        assert.equal(await this.mock.isFrozen(buyToken, sellToken), false);
                      });
                    });
                    describe("from trader", () => {
                      beforeEach(async () => {
                        await this.mock.unfreezePair(identifier, { from: trader });
                      });
                      it("pair unfrozen", async () => {
                        assert.equal(await this.mock.isFrozen(buyToken, sellToken), false);
                      });
                    });
                    describe("from system", () => {
                      beforeEach(async () => {
                        await this.mock.unfreezePair(identifier, { from: system });
                      });
                      it("pair unfrozen", async () => {
                        assert.equal(await this.mock.isFrozen(buyToken, sellToken), false);
                      });
                      describe("whenNotFrozenFunctionality", () => {
                        beforeEach(async () => {
                          await this.mock.whenNotFrozenAction(buyToken, sellToken, { from: operator });
                        });
                        it("paired action set", async () => {
                          assert.equal(await this.mock.WhenNotFrozenAction(), true);
                        });
                      });
                    });
                  });
                });
              });
            });
            describe("depair", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(this.mock.depairTokens(identifier, { from: attacker }), "Operatorable: caller does not have the operator role");
                });
                describe("when not paired", () => {
                  beforeEach(async () => {
                    await this.mock.depairTokens(identifier, { from: operator });
                  });
                  it("revert when not paired", async () => {
                    await expectRevert(this.mock.depairTokens(identifier, { from: operator }), "TradingPairWhitelist: pair ID not does not exist");
                  });
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.mock.depairTokens(identifier, { from: operator });
                });
                it("pair depaired", async () => {
                  assert.equal(await this.mock.isPaired(buyToken, sellToken), false);
                });
              });
            });
            describe("batch orders", () => {
              beforeEach(async () => {
                this.buyBatch = TWO_ADDRESSES;
                this.sellBatch = [THREE_HUNDRED_ADDRESS[0], THREE_HUNDRED_ADDRESS[1]];
                this.batchLonger = [THREE_HUNDRED_ADDRESS[2], THREE_HUNDRED_ADDRESS[3], THREE_HUNDRED_ADDRESS[4]];
              });
              describe("pair", () => {
                describe("non-functional", () => {
                  it("revert when from attacker", async () => {
                    await expectRevert(
                      this.mock.batchPairTokens(TWO_IDENTIFIER, this.buyBatch, this.sellBatch, { from: attacker }),
                      "Operatorable: caller does not have the operator role"
                    );
                  });
                  it("revert when batch greater than 256", async () => {
                    await expectRevert(
                      this.mock.batchPairTokens(THREE_HUNDRED_ADDRESS, THREE_HUNDRED_ADDRESS, THREE_HUNDRED_ADDRESS, { from: operator }),
                      "TradingPairWhitelist: batch count is greater than 256"
                    );
                  });
                  it("revert length not equal", async () => {
                    await expectRevert(
                      this.mock.batchPairTokens(TWO_IDENTIFIER, this.batchLonger, TWO_ADDRESSES, { from: operator }),
                      "TradingPairWhitelist: array lengths not equal"
                    );
                  });
                });
                describe("functional", () => {
                  beforeEach(async () => {
                    await this.mock.batchPairTokens(TWO_IDENTIFIER, this.buyBatch, this.sellBatch, { from: operator });
                  });
                  it("first pair set", async () => {
                    assert.equal(await this.mock.isPaired(this.buyBatch[0], this.sellBatch[0]), true);
                  });
                  it("second pair set", async () => {
                    assert.equal(await this.mock.isPaired(this.buyBatch[1], this.sellBatch[1]), true);
                  });
                  it("count updated", async () => {
                    assert.equal(await this.mock.getPairCount(), 3);
                  });
                  it("index key set", async () => {
                    assert.equal(await this.mock.getIdentifier(1), TWO_IDENTIFIER[0]);
                  });
                  describe("depair", () => {
                    describe("non-functional", () => {
                      it("revert when from attacker", async () => {
                        await expectRevert(
                          this.mock.batchDepairTokens(TWO_IDENTIFIER, { from: attacker }),
                          "Operatorable: caller does not have the operator role"
                        );
                      });
                      it("revert when batch greater than 256", async () => {
                        await expectRevert(
                          this.mock.batchDepairTokens(THREE_HUNDRED_ADDRESS, { from: operator }),
                          "TradingPairWhitelist: batch count is greater than 256"
                        );
                      });
                    });
                    describe("functional", () => {
                      beforeEach(async () => {
                        await this.mock.batchDepairTokens(TWO_IDENTIFIER, { from: operator });
                      });
                      it("first pair set", async () => {
                        assert.equal(await this.mock.isPaired(this.buyBatch[0], this.sellBatch[0]), false);
                      });
                      it("second pair set", async () => {
                        assert.equal(await this.mock.isPaired(this.buyBatch[1], this.sellBatch[1]), false);
                      });
                    });
                  });
                  describe("freeze", () => {
                    describe("non-functional", () => {
                      it("revert when from attacker", async () => {
                        await expectRevert(
                          this.mock.batchFreezeTokens(TWO_IDENTIFIER, { from: attacker }),
                          "TraderOperatorable: caller is not trader or operator or system"
                        );
                      });
                      it("revert when batch greater than 256", async () => {
                        await expectRevert(
                          this.mock.batchFreezeTokens(THREE_HUNDRED_ADDRESS, { from: operator }),
                          "TradingPairWhitelist: batch count is greater than 256"
                        );
                      });
                    });
                    describe("functional", () => {
                      beforeEach(async () => {
                        await this.mock.batchFreezeTokens(TWO_IDENTIFIER, { from: operator });
                      });
                      it("first frozen pair set", async () => {
                        assert.equal(await this.mock.isFrozen(this.buyBatch[0], this.sellBatch[0]), true);
                      });
                      it("second frozen pair set", async () => {
                        assert.equal(await this.mock.isFrozen(this.buyBatch[1], this.sellBatch[1]), true);
                      });
                      describe("unfreeze", () => {
                        describe("non-functional", () => {
                          it("revert when from attacker", async () => {
                            await expectRevert(
                              this.mock.batchUnfreezeTokens(TWO_IDENTIFIER, { from: attacker }),
                              "TraderOperatorable: caller is not trader or operator or system"
                            );
                          });
                          it("revert when batch greater than 256", async () => {
                            await expectRevert(
                              this.mock.batchUnfreezeTokens(THREE_HUNDRED_ADDRESS, { from: operator }),
                              "TradingPairWhitelist: batch count is greater than 256"
                            );
                          });
                        });
                        describe("functional", () => {
                          beforeEach(async () => {
                            await this.mock.batchUnfreezeTokens(TWO_IDENTIFIER, { from: operator });
                          });
                          it("first frozen pair set", async () => {
                            assert.equal(await this.mock.isFrozen(this.buyBatch[0], this.sellBatch[0]), false);
                          });
                          it("second frozen pair set", async () => {
                            assert.equal(await this.mock.isFrozen(this.buyBatch[1], this.sellBatch[1]), false);
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
