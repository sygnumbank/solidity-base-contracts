require("chai").should();

const { expectRevert, BaseOperators, BlockerOperators, RaiseOperators, TraderOperators, Whitelist, InitializeRouter, ZERO_ADDRESS } = require("../../common");

contract("InitializeRouter", ([admin, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.raiseOperators = await RaiseOperators.new({ from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });
    this.dchf = await Whitelist.new({ from: admin });
    this.whitelist = await Whitelist.new({ from: admin });

    this.initializeRouter = await InitializeRouter.new({ from: admin });
  });

  context("initialization", () => {
    describe("router initialized", () => {
      beforeEach(async () => {
        await this.initializeRouter.initialize(this.baseOperators.address);
      });
      describe("contracts initialized through router", () => {
        describe("non-functional", async () => {
          it("revert initialize empty raiseOperators", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                ZERO_ADDRESS,
                this.traderOperators.address,
                this.blockerOperators.address,
                this.dchf.address,
                this.whitelist.address,
                { from: admin }
              ),
              "InitializeRouter: contract addresses cannot be empty"
            );
          });
          it("revert initialize empty traderOperators", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                ZERO_ADDRESS,
                this.blockerOperators.address,
                this.dchf.address,
                this.whitelist.address,
                { from: admin }
              ),
              "InitializeRouter: contract addresses cannot be empty"
            );
          });
          it("revert initialize empty blockerOperators", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                this.traderOperators.address,
                ZERO_ADDRESS,
                this.dchf.address,
                this.whitelist.address,
                { from: admin }
              ),
              "InitializeRouter: contract addresses cannot be empty"
            );
          });
          it("revert initialize empty dchf", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                this.traderOperators.address,
                this.blockerOperators.address,
                ZERO_ADDRESS,
                this.whitelist.address,
                { from: admin }
              ),
              "InitializeRouter: contract addresses cannot be empty"
            );
          });
          it("revert initialize empty whitelist", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                this.traderOperators.address,
                ZERO_ADDRESS,
                this.dchf.address,
                ZERO_ADDRESS,
                {
                  from: admin,
                }
              ),
              "InitializeRouter: contract addresses cannot be empty"
            );
          });
          it("revert from attacker", async () => {
            await expectRevert(
              this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                this.traderOperators.address,
                this.blockerOperators.address,
                this.dchf.address,
                this.whitelist.address,
                { from: attacker }
              ),
              "Operatorable: caller does not have the admin role"
            );
          });
        });
        describe("functional", () => {
          describe("default baseOperators contract", () => {
            beforeEach(async () => {
              await this.initializeRouter.initializeContracts(
                ZERO_ADDRESS,
                this.raiseOperators.address,
                this.traderOperators.address,
                this.blockerOperators.address,
                this.dchf.address,
                this.whitelist.address,
                { from: admin }
              );
            });
            it("raiseOperators set", async () => {
              assert.equal(await this.raiseOperators.getOperatorsContract(), this.baseOperators.address);
            });
            it("traderOperators set", async () => {
              assert.equal(await this.traderOperators.getOperatorsContract(), this.baseOperators.address);
            });
            it("blockerOperators set", async () => {
              assert.equal(await this.blockerOperators.getOperatorsContract(), this.baseOperators.address);
            });
            it("dchf set", async () => {
              assert.equal(await this.blockerOperators.getOperatorsContract(), this.baseOperators.address);
            });
            it("whitelist set", async () => {
              assert.equal(await this.blockerOperators.getOperatorsContract(), this.baseOperators.address);
            });
          });
          describe("non-default baseOperators contract", () => {
            beforeEach(async () => {
              this.baseOperatorsNonDefault = await BaseOperators.new(admin, { from: admin });
              await this.initializeRouter.initializeContracts(
                this.baseOperatorsNonDefault.address,
                this.raiseOperators.address,
                this.traderOperators.address,
                this.blockerOperators.address,
                this.dchf.address,
                this.whitelist.address,
                { from: admin }
              );
            });
            it("raiseOperators set", async () => {
              assert.equal(await this.raiseOperators.getOperatorsContract(), this.baseOperatorsNonDefault.address);
            });
            it("traderOperators set", async () => {
              assert.equal(await this.traderOperators.getOperatorsContract(), this.baseOperatorsNonDefault.address);
            });
            it("blockerOperators set", async () => {
              assert.equal(await this.blockerOperators.getOperatorsContract(), this.baseOperatorsNonDefault.address);
            });
            it("dchf set", async () => {
              assert.equal(await this.dchf.getOperatorsContract(), this.baseOperatorsNonDefault.address);
            });
            it("whitelist set", async () => {
              assert.equal(await this.whitelist.getOperatorsContract(), this.baseOperatorsNonDefault.address);
            });
          });
        });
      });
    });
  });
});
