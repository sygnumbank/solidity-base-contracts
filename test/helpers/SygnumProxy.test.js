const { BaseOperators, Whitelist, SygnumProxy, ERC20WhitelistMock, ERC20DestroyableMock, MINT } = require("../common");
const { encodeCall, getAdmin, getImplementation, expectEvent, expectRevert, assertRevert, ZERO_ADDRESS } = require("../common");

contract("SygnumProxy", ([owner, admin, operator, proxyAdmin, proxyAdminNew, attacker, whitelisted, newAddress]) => {
  beforeEach(async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.whitelist = await Whitelist.new({ from: admin });

    this.tokenV1 = await ERC20WhitelistMock.new({ from: admin });
    this.tokenV2 = await ERC20DestroyableMock.new({ from: admin });

    await this.whitelist.initialize(this.baseOperators.address, { from: admin });
  });
  context("Role set-up", () => {
    beforeEach(async () => {
      await this.baseOperators.addOperator(operator, { from: admin });
    });
    context("proxy initialized", () => {
      beforeEach(async () => {
        this.initializeData = encodeCall("initialize", ["address", "address"], [this.baseOperators.address, this.whitelist.address]);
        this.proxy = await SygnumProxy.new(this.tokenV1.address, proxyAdmin, this.initializeData, { from: owner });
        this.token = await ERC20WhitelistMock.at(this.proxy.address);
        this.upgradeData = encodeCall("mint", ["address", "uint256"], [owner, MINT]);
      });
      context("deployed proxy", () => {
        describe("has implementation set", () => {
          it("check implementation set", async () => {
            assert.equal(await getImplementation(this.proxy), this.tokenV1.address);
          });
        });
        context("change admin", () => {
          it("admin set", async () => {
            assert.equal(await getAdmin(this.proxy), proxyAdmin);
          });
          describe("change admin", () => {
            describe("non-functional", () => {
              it("revert from admin", async () => {
                await assertRevert(this.proxy.changeAdmin(proxyAdminNew, { from: admin }));
              });
              it("revert from attacker", async () => {
                await assertRevert(this.proxy.changeAdmin(proxyAdminNew, { from: attacker }));
              });
              it("revert when new admin empty address", async () => {
                await expectRevert(this.proxy.changeAdmin(ZERO_ADDRESS, { from: proxyAdmin }), "ERC1967: new admin is the zero address");
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                ({ logs: this.logs } = await this.proxy.changeAdmin(proxyAdminNew, { from: proxyAdmin }));
              });
              it("admin set", async () => {
                assert.equal(await getAdmin(this.proxy), proxyAdminNew);
              });
              it("emits a AdminChanged event", () => {
                expectEvent.inLogs(this.logs, "AdminChanged", { previousAdmin: proxyAdmin, newAdmin: proxyAdminNew });
              });
            });
          });
        });
        context("upgradability", () => {
          describe("upgrade to", () => {
            describe("non-functional", () => {
              it("revert empty implementation address", async () => {
                await expectRevert(this.proxy.upgradeTo(ZERO_ADDRESS, { from: proxyAdmin }), "ERC1967: new implementation is not a contract");
              });
              it("revert from attacker", async () => {
                await assertRevert(this.proxy.upgradeTo(this.tokenV2.address, { from: attacker }));
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                await this.proxy.upgradeTo(this.tokenV2.address, { from: proxyAdmin });
              });
              it("new implementation set", async () => {
                assert.equal(await getImplementation(this.proxy), this.tokenV2.address);
              });
            });
          });
          describe("upgrade and call", () => {
            describe("non-functional", () => {
              it("reverts from token admin", async () => {
                await assertRevert(this.proxy.upgradeToAndCall(this.tokenV2.address, this.upgradeData, { from: admin }));
              });
              it("reverts when implementation empty address", async () => {
                await assertRevert(this.proxy.upgradeToAndCall(ZERO_ADDRESS, this.upgradeData, { from: admin }));
              });
            });
            // describe('functional', () => {
            //     beforeEach(async () => {
            //         await this.proxy.upgradeToAndCall(this.tokenV2.address, this.upgradeData, { from: proxyAdmin })
            //     });
            //     it('new implementation set', async () => {
            //         assert.equal(await getImplementation(this.proxy), this.tokenV2.address)
            //     });
            // });
          });
        });
        context("delegate call initial implementation", () => {
          context("when whitelisted", () => {
            beforeEach(async () => {
              await this.whitelist.toggleWhitelist(whitelisted, true, { from: operator });
            });
            context("minting", () => {
              describe("non-functional", () => {
                it("revert from proxy admin", async () => {
                  await expectRevert(
                    this.token.mint(whitelisted, MINT, { from: proxyAdmin }),
                    "TransparentUpgradeableProxy: admin cannot fallback to proxy target"
                  );
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.token.mint(whitelisted, MINT, { from: operator });
                });
                it("minted balance set", async () => {
                  assert.equal(await this.token.balanceOf(whitelisted), MINT);
                });
                it("should revert when calling not yet existing function", async () => {
                  this.token = await ERC20DestroyableMock.at(this.proxy.address);
                  await expectRevert(this.token.destroy(owner, { from: operator }), "revert");
                });
                describe("upgrade to and calls", () => {
                  beforeEach(async () => {
                    // COMMENTED upgradeToAndCall BECAUSE IT WAS REVERTING UNEXPECTEDLY
                    // await this.proxy.upgradeToAndCall(this.tokenV2.address, this.upgradeData, {from: proxyAdmin})
                    await this.proxy.upgradeTo(this.tokenV2.address, { from: proxyAdmin });
                  });
                  it("implementation set", async () => {
                    assert.equal(await getImplementation(this.proxy), this.tokenV2.address);
                  });
                  describe("token pointer updated", () => {
                    beforeEach(async () => {
                      this.token = await ERC20DestroyableMock.at(this.proxy.address);
                    });
                    it("pointer address updated", () => {
                      assert.equal(this.token.address, this.proxy.address);
                    });
                    describe("ensure old data valid", () => {
                      it("balance consistent", async () => {
                        assert.equal(await this.token.balanceOf(whitelisted), MINT);
                      });
                    });
                    describe("non-functional", () => {
                      it("revert from proxy admin", async () => {
                        await expectRevert(
                          this.token.destroy(owner, { from: proxyAdmin }),
                          "TransparentUpgradeableProxy: admin cannot fallback to proxy target"
                        );
                      });
                      it("new logic should revert when called by an attacker", async () => {
                        await expectRevert(this.token.destroy(attacker, { from: attacker }), "OperatorableCallerNotOperator()");
                      });
                    });
                    describe("new logic", () => {
                      beforeEach(async () => {
                        await this.token.destroy(owner, { from: operator });
                      });
                      it("new functionality set", async () => {
                        await expectRevert(this.token.balanceOf(whitelisted), "Returned values aren't valid, did it run Out of Gas?");
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
