const { expectRevert, BaseOperators, ERC20MintableMock, MINT } = require("../../common");

contract("ERC20Mintable", ([admin, operator, system, attacker, user]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await ERC20MintableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      beforeEach(async () => {
        await this.mock.initialize(this.baseOperators.address);
      });
      describe("roles assigned", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
          await this.baseOperators.addSystem(system, { from: admin });
        });
        describe("user mint", () => {
          describe("non-functional", () => {
            describe("revert from attacker", () => {
              beforeEach(async () => {
                await expectRevert(this.mock.mint(user, MINT, { from: attacker }), "OperatorableCallerNotOperatorOrSystem()");
              });
              it("balance not updated", async () => {
                assert.equal(await this.mock.balanceOf(user), MINT - MINT);
              });
            });
            it("revert mint balance equal to zero", async () => {
              await expectRevert(this.mock.mint(user, 0, { from: operator }), "ERC20MintableZeroMintAmount()");
            });
          });
          describe("functional", () => {
            describe("from operator", () => {
              beforeEach(async () => {
                await this.mock.mint(user, MINT, { from: operator });
              });
              it("balance updated", async () => {
                assert.equal(await this.mock.balanceOf(user), MINT);
              });
            });
            describe("from system", () => {
              beforeEach(async () => {
                await this.mock.mint(user, MINT, { from: system });
              });
              it("balance updated", async () => {
                assert.equal(await this.mock.balanceOf(user), MINT);
              });
            });
          });
        });
      });
    });
  });
});
