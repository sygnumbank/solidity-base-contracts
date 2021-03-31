const { expectRevert, Whitelist, Whitelistable, BaseOperators, ZERO_ADDRESS } = require("../../common");

contract("Whitelistable", ([owner, admin, operator, whitelisted, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });

    this.whitelist = await Whitelist.new({ from: admin });
    this.whitelistable = await Whitelistable.new({ from: admin });
  });
  context("role set", () => {
    beforeEach(async () => {
      await this.baseOperators.addOperator(operator, { from: admin });
    });
    context("whitelist set", () => {
      beforeEach(async () => {
        await this.whitelist.initialize(this.baseOperators.address);
        await this.whitelist.toggleWhitelist(whitelisted, true, { from: operator });
      });
      context("initialization", () => {
        describe("non-functional", () => {
          it("revert initialization with zero whitelist address", async () => {
            await expectRevert(
              this.whitelistable.initialize(this.baseOperators.address, ZERO_ADDRESS, { from: operator }),
              "Whitelistable: address of new whitelist contract cannot be zero"
            );
          });
          it("revert initialization with zero baseOperators address", async () => {
            await expectRevert(
              this.whitelistable.initialize(ZERO_ADDRESS, this.baseOperators.address, { from: operator }),
              "Operatorable: address of new operators contract cannot be zero"
            );
          });
        });
      });
      describe("functional", () => {
        beforeEach(async () => {
          await this.whitelistable.initialize(this.baseOperators.address, this.whitelist.address);
        });
        describe("correctly pointing to baseOperators", () => {
          it("baseOperator contract set", async () => {
            assert.equal(await this.whitelistable.getOperatorsContract(), this.baseOperators.address);
          });
          describe("roles set", () => {
            it("admin set", async () => {
              assert.equal(await this.whitelistable.isAdmin(admin), true);
            });
          });
        });
        describe("correctly pointing to whitelist", () => {
          it("whitelist contract set", async () => {
            assert.equal(await this.whitelistable.getWhitelistContract(), this.whitelist.address);
          });
          it("account whitelisted", async () => {
            assert.equal(await this.whitelistable.isWhitelisted(whitelisted), true);
          });
        });
        describe("initial  setup", () => {
          it("check isInitialized", async () => {
            assert.equal(await this.whitelistable.isInitialized(), true);
          });
          describe("non-functional", () => {
            it("can not be initialized twice", async () => {
              await expectRevert(
                this.whitelistable.initialize(this.baseOperators.address, this.whitelist.address),
                "Initializable: Contract instance has already been initialized"
              );
            });
          });
        });
      });
    });
    context("changing whitelist contract address in whitelistable instance", () => {
      beforeEach(async () => {
        this.whitelistNew = await Whitelist.new({ from: admin });
        await this.whitelistable.initialize(this.baseOperators.address, this.whitelist.address);
      });
      describe("non-functional", () => {
        it("revert attacker init changing", async () => {
          await expectRevert(
            this.whitelistable.setWhitelistContract(this.whitelistNew.address, { from: attacker }),
            "Operatorable: caller does not have the admin role"
          );
        });
        it("revert admin pass zero addr for new contract", async () => {
          await expectRevert(
            this.whitelistable.setWhitelistContract(ZERO_ADDRESS, { from: admin }),
            "Whitelistable: address of new whitelist contract can not be zero"
          );
        });
      });
      context("two step logic for changing whitelist contract address in Whitelist instance", () => {
        describe("when pending contract not set", () => {
          it("revert confirm", async () => {
            await expectRevert(
              this.whitelistable.confirmWhitelistContract({ from: admin }),
              "Whitelistable: address of new whitelist contract can not be zero"
            );
          });
        });
        describe("when pending contract set", () => {
          beforeEach(async () => {
            await this.whitelistable.setWhitelistContract(this.whitelistNew.address, { from: admin });
            await this.whitelistNew.initialize(this.baseOperators.address);
          });
          describe("non-functional", () => {
            it("revert caller not admin - he can not confirm (the second step)", async () => {
              await expectRevert(
                this.whitelistNew.confirmFor(this.whitelistable.address, { from: attacker }),
                "Operatorable: caller does not have the admin role"
              );
            });
            it("revert confirmation if caller is not pending whitelist contract address", async () => {
              await expectRevert(this.whitelistable.confirmWhitelistContract({ from: admin }), "Whitelistable: should be called from new whitelist contract");
            });
            it("revert confirmation address equal to zero", async () => {
              await expectRevert(this.whitelistNew.confirmFor(ZERO_ADDRESS, { from: admin }), "Whitelist: address cannot be empty");
            });
            describe("broken contract address", () => {
              it("revert admin finishing second step - @TODO does not give correct revert code ", async () => {
                // expectRevert(await this.whitelist.confirmFor(this.whitelistable.address, { from: admin }), 'BlockerOperators: pending address incorrect')
              });
            });
          });
          describe("functional", () => {
            it("new address pending", async () => {
              assert.equal(await this.whitelistable.getWhitelistPending(), this.whitelistNew.address);
            });
            it("current instance correct", async () => {
              assert.equal(await this.whitelistable.getWhitelistContract(), this.whitelist.address);
            });
            it("successful change applied - race condition", async () => {
              await this.whitelistNew.confirmFor(this.whitelistable.address, { from: admin });
            });
            describe("change baseOperators contract second time", async () => {
              beforeEach(async () => {
                await this.whitelistNew.confirmFor(this.whitelistable.address, { from: admin });
              });
              it("check pending, confirm and final setting new one baseOperators contract", async () => {
                this.whitelistNew1 = await Whitelist.new({ from: owner });
                await this.whitelistNew1.initialize(this.baseOperators.address);

                await this.whitelistable.setWhitelistContract(this.whitelistNew1.address, { from: admin });

                assert.equal(await this.whitelistable.getWhitelistPending(), this.whitelistNew1.address);
                assert.equal(await this.whitelistable.getWhitelistContract(), this.whitelistNew.address);

                await this.whitelistNew1.confirmFor(this.whitelistable.address, { from: admin });
                assert.equal(await this.whitelistable.getWhitelistContract(), this.whitelistNew1.address);
              });
            });
          });
        });
      });
    });
  });
});
