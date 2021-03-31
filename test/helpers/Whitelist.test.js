const { expectRevert, BaseOperators, WhitelistMock, ZERO_ADDRESS, THREE_HUNDRED_ADDRESS, TWO_ADDRESSES } = require("../common");

contract("Whitelist", ([admin, operator, system, relay, user, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await WhitelistMock.new({ from: admin });
  });

  describe("contract initialization", () => {
    beforeEach(async () => {
      await this.mock.initialize(this.baseOperators.address);
    });
    describe("base role initialization", () => {
      beforeEach(async () => {
        await this.baseOperators.addOperator(operator, { from: admin });
        await this.baseOperators.addSystem(system, { from: admin });
        await this.baseOperators.addRelay(relay, { from: admin });
      });
      context("individual actions", () => {
        context("when un-whitelisted", () => {
          describe("non-functional", () => {
            it("revert whitelisted action when unwhitelisted", async () => {
              await expectRevert(this.mock.whitelistedAction({ from: user }), "Whitelist: account is not whitelisted");
            });
            describe("whitelisting", () => {
              it("reverts when whitelisting from attacker", async () => {
                await expectRevert(
                  this.mock.toggleWhitelist(user, true, { from: attacker }),
                  "Operatorable: caller does not have the operator role nor system nor relay"
                );
              });
              it("revert empty address", async () => {
                await expectRevert(this.mock.toggleWhitelist(ZERO_ADDRESS, true, { from: operator }), "Whitelist: invalid address");
              });
            });
          });
          describe("functional", () => {
            describe("from operator", () => {
              beforeEach(async () => {
                await this.mock.toggleWhitelist(user, true, { from: operator });
              });
              it("is whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(user), true);
              });
            });
            describe("from system", () => {
              beforeEach(async () => {
                await this.mock.toggleWhitelist(user, true, { from: system });
              });
              it("is whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(user), true);
              });
            });
            describe("from relay", () => {
              beforeEach(async () => {
                await this.mock.toggleWhitelist(user, true, { from: relay });
              });
              it("is whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(user), true);
              });
              context("when whitelisted", () => {
                describe("non-functional", () => {
                  it("revert unwhitelisting from attacker", async () => {
                    await expectRevert(
                      this.mock.toggleWhitelist(user, false, { from: attacker }),
                      "Operatorable: caller does not have the operator role nor system nor relay"
                    );
                  });
                });
                describe("functional", () => {
                  describe("whitelisted functionality", async () => {
                    beforeEach(async () => {
                      await this.mock.whitelistedAction({ from: user });
                    });
                    it("whitelisted action set", async () => {
                      assert.equal(await this.mock.WhitelistedAction(), true);
                    });
                  });
                });
              });
            });
          });
        });
      });
      context("batch actions", () => {
        describe("whitelist", () => {
          describe("non-functional", () => {
            it("reverts when batch greater than 256", async () => {
              await expectRevert(this.mock.batchToggleWhitelist(THREE_HUNDRED_ADDRESS, true, { from: operator }), "Whitelist: batch count is greater than 256");
            });
            it("reverts when from attacker", async () => {
              await expectRevert(
                this.mock.batchToggleWhitelist(TWO_ADDRESSES, true, { from: attacker }),
                "Operatorable: caller does not have the operator role nor system nor relay"
              );
            });
          });
          describe("functional", () => {
            describe("from operator", () => {
              beforeEach(async () => {
                await this.mock.batchToggleWhitelist(TWO_ADDRESSES, true, { from: operator });
              });
              it("first address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), true);
              });
              it("second address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), true);
              });
            });
            describe("from system", () => {
              beforeEach(async () => {
                await this.mock.batchToggleWhitelist(TWO_ADDRESSES, true, { from: system });
              });
              it("first address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), true);
              });
              it("second address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), true);
              });
            });
            describe("from relay", () => {
              beforeEach(async () => {
                await this.mock.batchToggleWhitelist(TWO_ADDRESSES, true, { from: relay });
              });
              it("first address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), true);
              });
              it("second address whitelisted", async () => {
                assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), true);
              });
              describe("unwhitelist", () => {
                describe("non-functional", () => {
                  it("revert from attacker", async () => {
                    await expectRevert(
                      this.mock.batchToggleWhitelist(TWO_ADDRESSES, false, { from: attacker }),
                      "Operatorable: caller does not have the operator role nor system nor relay"
                    );
                  });
                });
                describe("functional", () => {
                  describe("from operator", () => {
                    beforeEach(async () => {
                      await this.mock.batchToggleWhitelist(TWO_ADDRESSES, false, { from: operator });
                    });
                    it("first address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), false);
                    });
                    it("second address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), false);
                    });
                  });
                  describe("from system", () => {
                    beforeEach(async () => {
                      await this.mock.batchToggleWhitelist(TWO_ADDRESSES, false, { from: system });
                    });
                    it("first address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), false);
                    });
                    it("second address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), false);
                    });
                  });
                  describe("from relay", () => {
                    beforeEach(async () => {
                      await this.mock.batchToggleWhitelist(TWO_ADDRESSES, false, { from: relay });
                    });
                    it("first address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[0]), false);
                    });
                    it("second address whitelisted", async () => {
                      assert.equal(await this.mock.isWhitelisted(TWO_ADDRESSES[1]), false);
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
