const { expectRevert, BaseOperators, Whitelist, WhitelistableMock } = require("../../common");

contract("WhitelistableMock", ([admin, operator, whitelisted, notWhitelisted, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    await this.baseOperators.addOperator(operator, { from: admin });

    this.whitelist = await Whitelist.new({ from: admin });
    await this.whitelist.initialize(this.baseOperators.address);

    this.mock = await WhitelistableMock.new();
    await this.mock.initialize(this.baseOperators.address, this.whitelist.address);
  });

  context("whitelist initialization", () => {
    beforeEach(async () => {
      await this.whitelist.toggleWhitelist(whitelisted, true, { from: operator });
    });
    describe("whitelisted action", () => {
      describe("non-functional", () => {
        it("reverts when not whitelisted", async () => {
          await expectRevert(this.mock.whitelistedAction({ from: attacker }), "Whitelistable: account is not whitelisted");
        });
      });
      describe("functional", () => {
        describe("when whitelisted", () => {
          beforeEach(async () => {
            await this.mock.whitelistedAction({ from: whitelisted });
          });
          it("whitelisted action set", async () => {
            assert.equal(await this.mock.WhitelistedAction(), true);
          });
        });
      });
    });
    describe("unwhitelisted action", () => {
      describe("functional", () => {
        describe("when nonwhitelisted", () => {
          beforeEach(async () => {
            await this.mock.unwhitelistedAction({ from: notWhitelisted });
          });
          it("unwhitelisted action set", async () => {
            assert.equal(await this.mock.UnwhitelistedAction(), true);
          });
        });
      });
    });
  });
});
