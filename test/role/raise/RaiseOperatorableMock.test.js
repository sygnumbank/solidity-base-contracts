const { expectRevert, BaseOperators, RaiseOperators, RaiseOperatorableMock } = require("../../common");

contract("RaiseOperatorableMock", ([admin, operator, investor, issuer, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    await this.baseOperators.addOperator(operator, { from: admin });

    this.raiseOperators = await RaiseOperators.new({ from: admin });
    await this.raiseOperators.initialize(this.baseOperators.address);

    this.mock = await RaiseOperatorableMock.new();
    await this.mock.setContract(this.baseOperators.address, this.raiseOperators.address);
  });

  context("mock initialization", () => {
    beforeEach(async () => {
      await this.raiseOperators.addInvestor(investor, { from: operator });
      await this.raiseOperators.addIssuer(issuer, { from: operator });
    });
    describe("investor action", () => {
      describe("non-functional", () => {
        it("reverts when not investor", async () => {
          await expectRevert(this.mock.investorAction({ from: attacker }), "RaiseOperatorable: caller is not investor");
        });
      });
      describe("functional", () => {
        describe("when investor", () => {
          beforeEach(async () => {
            await this.mock.investorAction({ from: investor });
          });
          it("investor action set", async () => {
            assert.equal(await this.mock.InvestorAction(), true);
          });
        });
      });
    });
    describe("issuer action", () => {
      describe("non-functional", () => {
        it("reverts when not issuer", async () => {
          await expectRevert(this.mock.issuerAction({ from: attacker }), "RaiseOperatorable: caller is not issuer");
        });
      });
      describe("functional", () => {
        describe("when issuer", () => {
          beforeEach(async () => {
            await this.mock.issuerAction({ from: issuer });
          });
          it("issuer action set", async () => {
            assert.equal(await this.mock.IssuerAction(), true);
          });
        });
      });
    });
  });
});
