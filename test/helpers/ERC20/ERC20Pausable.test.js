const { expectRevert, BaseOperators, ERC20PausableMock, MINT, TRANSFER } = require("../../common");

contract("ERC20Pausable", ([admin, operator, user, receiver, other, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin);
    this.mock = await ERC20PausableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      beforeEach(async () => {
        await this.mock.initialize(this.baseOperators.address);
      });
      describe("roles assigned", () => {
        beforeEach(async () => {
          await this.baseOperators.addOperator(operator, { from: admin });
        });
        describe("user balance minted", () => {
          beforeEach(async () => {
            await this.mock.mint(user, MINT);
          });
          describe("not paused", () => {
            beforeEach(async () => {
              assert.equal(await this.mock.isNotPaused(), true, "is paused");
            });
            describe("transfer", () => {
              beforeEach(async () => {
                await this.mock.transfer(receiver, TRANSFER, { from: user });
              });
              it("user balance updated", async () => {
                assert.equal(await this.mock.balanceOf(user), MINT - TRANSFER, "sender balance not updated");
              });
              it("receiver balance updated", async () => {
                assert.equal(await this.mock.balanceOf(receiver), TRANSFER, "receiver balance not updated");
              });
              describe("approval", () => {
                beforeEach(async () => {
                  await this.mock.approve(receiver, TRANSFER, { from: user });
                });
                it("allowance updated", async () => {
                  assert.equal(await this.mock.allowance(user, receiver), TRANSFER, "allowance not updated");
                });
                describe("transferFrom", () => {
                  beforeEach(async () => {
                    await this.mock.transferFrom(user, other, TRANSFER, { from: receiver });
                  });
                  it("allowance updated", async () => {
                    assert.equal(await this.mock.allowance(user, receiver), TRANSFER - TRANSFER, "transferFrom allowance not updated");
                  });
                  it("other balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(other), TRANSFER, "other balance not updated");
                  });
                });
                describe("increaseAllowance", () => {
                  beforeEach(async () => {
                    await this.mock.increaseAllowance(receiver, TRANSFER, { from: user });
                  });
                  it("allowance increased", async () => {
                    assert.equal(await this.mock.allowance(user, receiver), TRANSFER + TRANSFER, "transferFrom allowance not updated");
                  });
                });
                describe("decreaseAllowance", () => {
                  beforeEach(async () => {
                    await this.mock.decreaseAllowance(receiver, TRANSFER, { from: user });
                  });
                  it("allowance decreased", async () => {
                    assert.equal(await this.mock.allowance(user, receiver), TRANSFER - TRANSFER, "decreaseAllowance not updated");
                  });
                });
                describe("burn", () => {
                  beforeEach(async () => {
                    await this.mock.burn(TRANSFER, { from: user });
                  });
                  it("balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(user), MINT - TRANSFER - TRANSFER, "burn balance not updated");
                  });
                });
                describe("burnFrom", () => {
                  beforeEach(async () => {
                    await this.mock.burnFrom(user, TRANSFER, { from: receiver });
                  });
                  it("balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(user), MINT - TRANSFER - TRANSFER, "burnFrom balance not updated");
                  });
                });
                describe("mint", () => {
                  beforeEach(async () => {
                    await this.mock.mint(user, TRANSFER);
                  });
                  it("balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(user), MINT - TRANSFER + TRANSFER, "_mint balance not updated");
                  });
                });
              });
            });
          });
          describe("paused", () => {
            context("pausing", async () => {
              describe("from operator", () => {
                beforeEach(async () => {
                  await this.mock.pause({ from: operator });
                });
                it("revert pause when already paused", async () => {
                  await expectRevert(this.mock.pause({ from: operator }), "PausablePaused()");
                });
                describe("revert transfer", () => {
                  beforeEach(async () => {
                    await expectRevert(this.mock.transfer(receiver, TRANSFER, { from: user }), "PausablePaused()");
                  });
                  it("user not balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(user), MINT, "sender balance has updated");
                  });
                  it("receiver not balance updated", async () => {
                    assert.equal(await this.mock.balanceOf(receiver), MINT - MINT, "receiver balance has updated");
                  });
                  describe("revert approval", () => {
                    beforeEach(async () => {
                      await expectRevert(this.mock.approve(receiver, TRANSFER, { from: user }), "PausablePaused()");
                    });
                    it("allowance not updated", async () => {
                      assert.equal(await this.mock.allowance(user, receiver), MINT - MINT, "allowance has updated");
                    });
                    describe("revert transferFrom", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.transferFrom(user, other, TRANSFER, { from: receiver }), "PausablePaused()");
                      });
                      it("allowance updated", async () => {
                        assert.equal(await this.mock.allowance(user, receiver), TRANSFER - TRANSFER, "transferFrom allowance has update");
                      });
                      it("other balance updated", async () => {
                        assert.equal(await this.mock.balanceOf(other), TRANSFER - TRANSFER, "other balance has updated");
                      });
                    });
                    describe("revert increaseAllowance", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.increaseAllowance(receiver, TRANSFER, { from: user }), "PausablePaused()");
                      });
                      it("allowance not increased", async () => {
                        assert.equal(await this.mock.allowance(user, receiver), MINT - MINT, "transferFrom allowance has update");
                      });
                    });
                    describe("revert decreaseAllowance", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.decreaseAllowance(receiver, TRANSFER, { from: user }), "PausablePaused()");
                      });
                      it("allowance not decreased", async () => {
                        assert.equal(await this.mock.allowance(user, receiver), MINT - MINT, "decreaseAllowance has update");
                      });
                    });
                    describe("revert burn", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.burn(TRANSFER, { from: user }), "PausablePaused()");
                      });
                      it("balance updated", async () => {
                        assert.equal(await this.mock.balanceOf(user), MINT, "burn balance has update");
                      });
                    });
                    describe("revert burnFrom", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.burnFrom(user, TRANSFER, { from: receiver }), "PausablePaused()");
                      });
                      it("balance updated", async () => {
                        assert.equal(await this.mock.balanceOf(user), MINT, "burnFrom balance has update");
                      });
                    });
                    describe("revert mint", () => {
                      beforeEach(async () => {
                        await expectRevert(this.mock.mint(user, TRANSFER), "PausablePaused()");
                      });
                      it("balance updated", async () => {
                        assert.equal(await this.mock.balanceOf(user), MINT, "mint balance has updated");
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
