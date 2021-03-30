const { expectRevert, BaseOperators, ERC20FreezableMock, MINT, TRANSFER } = require("../../common");

contract("ERC20Freezable", ([admin, operator, user, anotherUser, frozenSender, frozenReceiver]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await ERC20FreezableMock.new();
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
        describe("user balance mint", () => {
          beforeEach(async () => {
            await this.mock.mint(user, MINT);
          });
          it("balance updated", async () => {
            assert.equal(await this.mock.balanceOf(user), MINT);
          });
          describe("freeze accounts", () => {
            beforeEach(async () => {
              await this.mock.batchToggleFreeze([frozenSender, frozenReceiver], true, { from: operator });
            });
            it("sender frozen", async () => {
              assert.equal(await this.mock.isFrozen(frozenSender), true);
            });
            it("receiver frozen", async () => {
              assert.equal(await this.mock.isFrozen(frozenReceiver), true);
            });
            describe("transfer", () => {
              it("revert frozen sender", async () => {
                await expectRevert(this.mock.transfer(user, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
              });
              it("revert frozen receiver", async () => {
                await expectRevert(this.mock.transfer(frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
              });
              describe("from non-frozen to non-frozen", async () => {
                beforeEach(async () => {
                  await this.mock.transfer(anotherUser, TRANSFER, { from: user });
                });
                it("receiver balance updated", async () => {
                  assert.equal(await this.mock.balanceOf(anotherUser), TRANSFER);
                });
                it("sender balance updated", async () => {
                  assert.equal(await this.mock.balanceOf(user), MINT - TRANSFER);
                });
              });
            });
            describe("approve", () => {
              it("revert frozen sender", async () => {
                await expectRevert(this.mock.approve(user, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
              });
              it("revert frozen receiver", async () => {
                await expectRevert(this.mock.approve(frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
              });
              describe("from non-frozen to non-frozen", async () => {
                beforeEach(async () => {
                  await this.mock.approve(anotherUser, TRANSFER, { from: user });
                });
                it("allowance balance updated", async () => {
                  assert.equal(await this.mock.allowance(user, anotherUser), TRANSFER);
                });
                describe("transferFrom", () => {
                  it("revert frozen sender", async () => {
                    await expectRevert(this.mock.transferFrom(user, anotherUser, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
                  });
                  it("revert frozen owner", async () => {
                    await expectRevert(this.mock.transferFrom(frozenReceiver, anotherUser, TRANSFER, { from: user }), "Freezable: account is frozen");
                  });
                  it("revert frozen receiver", async () => {
                    await expectRevert(this.mock.transferFrom(anotherUser, frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
                  });
                  describe("from non-frozen to non-frozen", async () => {
                    beforeEach(async () => {
                      await this.mock.transferFrom(user, anotherUser, TRANSFER, { from: anotherUser });
                    });
                    it("allowance balance updated", async () => {
                      assert.equal(await this.mock.allowance(user, anotherUser), TRANSFER - TRANSFER);
                    });
                    it("balance updated", async () => {
                      assert.equal(await this.mock.balanceOf(anotherUser), TRANSFER);
                    });
                  });
                });
              });
              describe("increaseAllowance", () => {
                it("revert frozen sender", async () => {
                  await expectRevert(this.mock.increaseAllowance(user, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
                });
                it("revert frozen receiver", async () => {
                  await expectRevert(this.mock.increaseAllowance(frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
                });
                describe("from non-frozen to non-frozen", async () => {
                  beforeEach(async () => {
                    await this.mock.increaseAllowance(anotherUser, TRANSFER, { from: user });
                  });
                  it("allowance balance updated", async () => {
                    assert.equal(await this.mock.allowance(user, anotherUser), TRANSFER);
                  });
                  describe("decreaseAllowance", () => {
                    it("revert frozen sender", async () => {
                      await expectRevert(this.mock.decreaseAllowance(user, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
                    });
                    it("revert frozen receiver", async () => {
                      await expectRevert(this.mock.decreaseAllowance(frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
                    });
                    describe("from non-frozen to non-frozen", async () => {
                      beforeEach(async () => {
                        await this.mock.decreaseAllowance(anotherUser, TRANSFER, { from: user });
                      });
                      it("allowance balance updated", async () => {
                        assert.equal(await this.mock.allowance(user, anotherUser), TRANSFER - TRANSFER);
                      });
                    });
                  });
                  describe("burnFrom", () => {
                    it("revert frozen sender", async () => {
                      await expectRevert(this.mock.burnFrom(user, TRANSFER, { from: frozenSender }), "Freezable: account is frozen");
                    });
                    it("revert frozen owner", async () => {
                      await expectRevert(this.mock.burnFrom(frozenReceiver, TRANSFER, { from: user }), "Freezable: account is frozen");
                    });
                    describe("from non-frozen to non-frozen", async () => {
                      beforeEach(async () => {
                        await this.mock.burnFrom(user, TRANSFER, { from: anotherUser });
                      });
                      it("allowance balance updated", async () => {
                        assert.equal(await this.mock.allowance(user, anotherUser), TRANSFER - TRANSFER);
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
