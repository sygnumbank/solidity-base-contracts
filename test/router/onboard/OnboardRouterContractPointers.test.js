require("chai").should();

const {
  expectRevert,
  BaseOperators,
  BlockerOperators,
  RaiseOperators,
  TraderOperators,
  OnboardRouter,
  InitializeRouter,
  Whitelist,
  ZERO_ADDRESS,
} = require("../../common");

contract("OnboardRouterContractPointers", ([admin, operator, system, relay, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.blockerOperators = await BlockerOperators.new({ from: admin });
    this.raiseOperators = await RaiseOperators.new({ from: admin });
    this.traderOperators = await TraderOperators.new({ from: admin });

    this.initializeRouter = await InitializeRouter.new({ from: admin });
    this.onboardRouter = await OnboardRouter.new({ from: admin });

    this.dchf = await Whitelist.new({ from: admin });
    this.whitelist = await Whitelist.new({ from: admin });
  });

  context("initialization", () => {
    describe("necessary contract initialized", () => {
      beforeEach(async () => {
        await this.initializeRouter.initialize(this.baseOperators.address);
        await this.onboardRouter.initialize(this.baseOperators.address);
      });
      describe("necessary roles istantiated", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
          await this.baseOperators.addSystem(system, { from: admin });
          await this.baseOperators.addRelay(relay, { from: admin });
        });
        describe("contracts initialized", () => {
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
          describe("contracts referencing whitelist", () => {
            beforeEach(async () => {
              this.whitelistNonDefault = await Whitelist.new({ from: admin });
            });
            describe("change Whitelist address", () => {
              describe("non-functional", () => {
                it("revert from attacker", async () => {
                  await expectRevert(
                    this.onboardRouter.changeWhitelistContract(this.whitelistNonDefault.address, { from: attacker }),
                    "Operatorable: caller does not have the admin role"
                  );
                });
                it("revert empty address", async () => {
                  await expectRevert(
                    this.onboardRouter.changeWhitelistContract(ZERO_ADDRESS, { from: admin }),
                    "OnboardRouter: address of new whitelist contract cannot be zero"
                  );
                });
              });
              describe("functional", () => {
                beforeEach(async () => {
                  await this.onboardRouter.changeWhitelistContract(this.whitelistNonDefault.address, { from: admin });
                });
                it("new Whitelist contract set", async () => {
                  assert.equal(await this.onboardRouter.getWhitelistContract(), this.whitelistNonDefault.address);
                });
              });
            });
          });
          describe("change BaseOperators address", () => {
            beforeEach(async () => {
              this.baseOperatorsNonDefault = await BaseOperators.new(admin, { from: admin });
            });
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.changeBaseOperatorsContract(this.baseOperatorsNonDefault.address, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
              it("revert empty address", async () => {
                await expectRevert(
                  this.onboardRouter.changeBaseOperatorsContract(ZERO_ADDRESS, { from: admin }),
                  "OnboardRouter: address of new baseOperators contract cannot be zero"
                );
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                await this.onboardRouter.changeBaseOperatorsContract(this.baseOperatorsNonDefault.address, { from: admin });
              });
              it("new BaseOperators contract set", async () => {
                assert.equal(await this.onboardRouter.getBaseOperatorsContract(), this.baseOperatorsNonDefault.address);
              });
            });
          });
          describe("change RaiseOperators address", () => {
            beforeEach(async () => {
              this.raiseOperatorsNonDefault = await RaiseOperators.new({ from: admin });
            });
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.changeRaiseOperatorsContract(this.raiseOperatorsNonDefault.address, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
              it("revert empty address", async () => {
                await expectRevert(
                  this.onboardRouter.changeRaiseOperatorsContract(ZERO_ADDRESS, { from: admin }),
                  "OnboardRouter: address of new raiseOperators contract cannot be zero"
                );
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                await this.onboardRouter.changeRaiseOperatorsContract(this.raiseOperatorsNonDefault.address, { from: admin });
              });
              it("new RaiseOperators contract set", async () => {
                assert.equal(await this.onboardRouter.getRaiseOperatorsContract(), this.raiseOperatorsNonDefault.address);
              });
            });
          });
          describe("change TraderOperators address", () => {
            beforeEach(async () => {
              this.traderOperatorsNonDefault = await RaiseOperators.new({ from: admin });
            });
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.changeTraderOperatorsContract(this.traderOperatorsNonDefault.address, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
              it("revert empty address", async () => {
                await expectRevert(
                  this.onboardRouter.changeTraderOperatorsContract(ZERO_ADDRESS, { from: admin }),
                  "OnboardRouter: address of new traderOperators contract cannot be zero"
                );
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                await this.onboardRouter.changeTraderOperatorsContract(this.traderOperatorsNonDefault.address, { from: admin });
              });
              it("new TraderOperators contract set", async () => {
                assert.equal(await this.onboardRouter.getTraderOperatorsContract(), this.traderOperatorsNonDefault.address);
              });
            });
          });
          describe("change BlockerOperators address", () => {
            beforeEach(async () => {
              this.blockerOperatorsNonDefault = await BlockerOperators.new({ from: admin });
            });
            describe("non-functional", () => {
              it("revert from attacker", async () => {
                await expectRevert(
                  this.onboardRouter.changeBlockerOperatorsContract(this.blockerOperatorsNonDefault.address, { from: attacker }),
                  "Operatorable: caller does not have the admin role"
                );
              });
              it("revert empty address", async () => {
                await expectRevert(
                  this.onboardRouter.changeBlockerOperatorsContract(ZERO_ADDRESS, { from: admin }),
                  "OnboardRouter: address of new blockerOperators contract cannot be zero"
                );
              });
            });
            describe("functional", () => {
              beforeEach(async () => {
                await this.onboardRouter.changeBlockerOperatorsContract(this.blockerOperatorsNonDefault.address, { from: admin });
              });
              it("new TraderOperators contract set", async () => {
                assert.equal(await this.onboardRouter.getBlockerOperatorsContract(), this.blockerOperatorsNonDefault.address);
              });
            });
          });
        });
      });
    });
  });
});
