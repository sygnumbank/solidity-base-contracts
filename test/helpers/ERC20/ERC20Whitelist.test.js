const { expectRevert, BaseOperators, Whitelist, ERC20WhitelistMock, MINT, BURN, TRANSFER } = require("../../common");

contract("ERC20Whitelist", ([admin, operator, whitelistedSender, whitelistReciever, whitelisted, nonWhitelisted]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin);
    this.whitelist = await Whitelist.new();
    this.mock = await ERC20WhitelistMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      beforeEach(async () => {
        await this.whitelist.initialize(this.baseOperators.address);
        await this.mock.initialize(this.baseOperators.address, this.whitelist.address);
      });
      describe("roles assigned", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
        });
        describe("user balance mint", () => {
          beforeEach(async () => {
            await this.whitelist.batchToggleWhitelist([whitelistedSender, whitelistReciever, whitelisted], true, { from: operator });
            await this.mock.mint(whitelistedSender, MINT);
          });
          describe("transfer", () => {
            it("revert non-whitelisted sender", async () => {
              await expectRevert(this.mock.transfer(whitelistReciever, TRANSFER, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
            });
            it("revert non-whitelisted receiver", async () => {
              await expectRevert(this.mock.transfer(nonWhitelisted, TRANSFER, { from: whitelistedSender }), "Whitelistable: account is not whitelisted");
            });
            describe("from whitelisted to whitelisted", async () => {
              beforeEach(async () => {
                await this.mock.transfer(whitelistReciever, TRANSFER, { from: whitelistedSender });
              });
              it("receiver balance updated", async () => {
                assert.equal(await this.mock.balanceOf(whitelistReciever), TRANSFER, "balance not updated");
              });
              it("sender balance updated", async () => {
                assert.equal(await this.mock.balanceOf(whitelistedSender), MINT - TRANSFER, "balance not updated");
              });
            });
          });
          describe("increaseAllowance", () => {
            it("revert non-whitelisted sender", async () => {
              await expectRevert(this.mock.increaseAllowance(whitelisted, TRANSFER, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
            });
            it("revert non-whitelisted receiver", async () => {
              await expectRevert(
                this.mock.increaseAllowance(nonWhitelisted, TRANSFER, { from: whitelistedSender }),
                "Whitelistable: account is not whitelisted"
              );
            });
            describe("from whitelisted to whitelisted", async () => {
              beforeEach(async () => {
                await this.mock.increaseAllowance(whitelistReciever, TRANSFER, { from: whitelistedSender });
              });
              it("receiver balance updated", async () => {
                assert.equal(await this.mock.allowance(whitelistedSender, whitelistReciever), TRANSFER, "balance not updated");
              });
              describe("decreaseAllowance", () => {
                it("revert non-whitelisted sender", async () => {
                  await expectRevert(this.mock.decreaseAllowance(whitelisted, TRANSFER, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
                });
                it("revert non-whitelisted receiver", async () => {
                  await expectRevert(
                    this.mock.decreaseAllowance(nonWhitelisted, TRANSFER, { from: whitelistedSender }),
                    "Whitelistable: account is not whitelisted"
                  );
                });
                describe("from whitelisted to whitelisted", async () => {
                  beforeEach(async () => {
                    await this.mock.decreaseAllowance(whitelistReciever, TRANSFER, { from: whitelistedSender });
                  });
                  it("receiver balance updated", async () => {
                    assert.equal(await this.mock.allowance(whitelistedSender, whitelistReciever), TRANSFER - TRANSFER, "balance not updated");
                  });
                });
              });
            });
          });
          describe("burn", () => {
            it("revert non-whitelisted burn ", async () => {
              await expectRevert(this.mock.burn(BURN, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
            });
            describe("from from whitelisted", () => {
              beforeEach(async () => {
                await this.mock.burn(BURN, { from: whitelistedSender });
              });
              it("sender balance updated", async () => {
                assert.equal(await this.mock.balanceOf(whitelistedSender), MINT - BURN, "sender balance not updated");
              });
            });
          });
          describe("MINT", () => {
            it("revert non-whitelisted MINT ", async () => {
              await expectRevert(this.mock.mint(nonWhitelisted, MINT), "Whitelistable: account is not whitelisted");
            });
            describe("from from whitelisted", () => {
              beforeEach(async () => {
                await this.mock.mint(whitelistReciever, MINT);
              });
              it("sender balance updated", async () => {
                assert.equal(await this.mock.balanceOf(whitelistedSender), MINT, "sender balance not updated");
              });
            });
          });
          describe("approve", () => {
            it("revert non-whitelisted sender", async () => {
              await expectRevert(this.mock.approve(whitelisted, TRANSFER, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
            });
            it("revert non-whitelisted receiver", async () => {
              await expectRevert(this.mock.approve(nonWhitelisted, TRANSFER, { from: whitelistedSender }), "Whitelistable: account is not whitelisted");
            });
            describe("from whitelisted to whitelisted", async () => {
              beforeEach(async () => {
                await this.mock.approve(whitelistReciever, TRANSFER, { from: whitelistedSender });
              });
              it("receiver balance updated", async () => {
                assert.equal(await this.mock.allowance(whitelistedSender, whitelistReciever), TRANSFER, "balance not updated");
              });
              describe("transferFrom", () => {
                it("revert non-whitelisted sender", async () => {
                  await expectRevert(
                    this.mock.transferFrom(whitelistedSender, whitelistReciever, TRANSFER, { from: nonWhitelisted }),
                    "Whitelistable: account is not whitelisted"
                  );
                });
                it("revert non-whitelisted owner", async () => {
                  await expectRevert(
                    this.mock.transferFrom(nonWhitelisted, whitelistReciever, TRANSFER, { from: whitelistedSender }),
                    "Whitelistable: account is not whitelisted"
                  );
                });
                it("revert non-whitelisted receiver", async () => {
                  await expectRevert(
                    this.mock.transferFrom(whitelistReciever, nonWhitelisted, TRANSFER, { from: whitelistedSender }),
                    "Whitelistable: account is not whitelisted"
                  );
                });
                describe("from whitelisted to whitelisted with whitelisted", async () => {
                  beforeEach(async () => {
                    await this.mock.transferFrom(whitelistedSender, whitelisted, TRANSFER, { from: whitelistReciever });
                  });
                  it("whitelisted balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(whitelisted), TRANSFER, "balance not updated");
                  });
                });
              });
              describe("burnFrom", () => {
                it("revert non-whitelisted sender", async () => {
                  await expectRevert(this.mock.burnFrom(whitelistedSender, BURN, { from: nonWhitelisted }), "Whitelistable: account is not whitelisted");
                });
                it("revert non-whitelisted owner", async () => {
                  await expectRevert(this.mock.burnFrom(nonWhitelisted, BURN, { from: whitelistedSender }), "Whitelistable: account is not whitelisted");
                });
                describe("from whitelisted to whitelisted with whitelisted", async () => {
                  beforeEach(async () => {
                    await this.mock.burnFrom(whitelistedSender, TRANSFER, { from: whitelistReciever });
                  });
                  it("whitelisted balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(whitelistedSender), MINT - BURN, "balance not updated");
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
