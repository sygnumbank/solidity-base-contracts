const { expectRevert, BaseOperators, ERC20ConfiscatableMock, MINT, CONFISCATE, THREE_HUNDRED_ADDRESS, THREE_HUNDRED_NUMBERS } = require("../../common");

contract("ERC20Confiscatable", ([admin, operator, user, anotherUser, receiver, anotherReceiver, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.mock = await ERC20ConfiscatableMock.new();
  });
  context("deployed", () => {
    describe("initialization", () => {
      describe("confiscatable mock", () => {
        beforeEach(async () => {
          await this.mock.initialize(this.baseOperators.address);
        });
        describe("roles assigned", () => {
          describe("operator", () => {
            beforeEach(async () => {
              await this.baseOperators.addOperator(operator, { from: admin });
            });
            it("operator role assigned", async () => {
              assert.equal(await this.baseOperators.isOperator(operator), true);
            });
            describe("user balance mint", () => {
              beforeEach(async () => {
                await this.mock.mint(user, MINT);
              });
              it("balance updated", async () => {
                assert.equal(await this.mock.balanceOf(user), MINT);
              });
              describe("confiscate", () => {
                describe("non-functional", () => {
                  describe("from attacker", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.confiscate(user, receiver, CONFISCATE, { from: attacker }),
                        "Operatorable: caller does not have the operator role"
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                });
                describe("functional", () => {
                  describe("from operator", () => {
                    beforeEach(async () => {
                      await this.mock.confiscate(user, receiver, CONFISCATE, { from: operator });
                    });
                    it("user balance updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT - CONFISCATE);
                    });
                    it("receiver balance updated", async () => {
                      assert.equal(await this.mock.balanceOf(receiver), CONFISCATE);
                    });
                  });
                });
              });
              describe("batch confiscate", () => {
                describe("non-functional", () => {
                  describe("from attacker", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.batchConfiscate([user, anotherUser], [receiver, anotherReceiver], [CONFISCATE, CONFISCATE], { from: attacker }),
                        "Operatorable: caller does not have the operator role"
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                  describe("confiscatees unbalanced length", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.batchConfiscate([user], [receiver, anotherReceiver], [CONFISCATE, CONFISCATE], { from: attacker }),
                        "ERC20ConfiscatableMock: confiscatees, recipients and values are not equal"
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                  describe("receivers unbalanced length", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.batchConfiscate([user, anotherUser], [receiver], [CONFISCATE, CONFISCATE], { from: attacker }),
                        "ERC20ConfiscatableMock: confiscatees, recipients and values are not equal"
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                  describe("user does not have required balance", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.batchConfiscate([user, anotherUser], [receiver, anotherReceiver], [CONFISCATE, CONFISCATE], { from: operator }),
                        "ERC20: transfer amount exceeds balance"
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                  describe("confiscatees length is great than batch limit", () => {
                    beforeEach(async () => {
                      await expectRevert(
                        this.mock.batchConfiscate(THREE_HUNDRED_ADDRESS, THREE_HUNDRED_ADDRESS, THREE_HUNDRED_NUMBERS, { from: operator }),
                        "ERC20ConfiscatableMock: batch count is greater than BATCH_LIMIT."
                      );
                    });
                    it("balance not updated", async () => {
                      assert.equal(await this.mock.balanceOf(user), MINT);
                    });
                  });
                });
                describe("functional", () => {
                  describe("second user has balance", () => {
                    beforeEach(async () => {
                      await this.mock.mint(anotherUser, MINT);
                    });
                    it("balance updated", async () => {
                      assert.equal(await this.mock.balanceOf(anotherUser), MINT);
                    });
                    describe("from operator", () => {
                      beforeEach(async () => {
                        await this.mock.batchConfiscate([user, anotherUser], [receiver, anotherReceiver], [CONFISCATE, CONFISCATE], { from: operator });
                      });
                      describe("users balance updated", () => {
                        it("first user", async () => {
                          assert.equal(await this.mock.balanceOf(user), MINT - CONFISCATE);
                        });
                        it("second user", async () => {
                          assert.equal(await this.mock.balanceOf(user), MINT - CONFISCATE);
                        });
                      });
                      describe("receivers balance updated", () => {
                        it("first receiver", async () => {
                          assert.equal(await this.mock.balanceOf(receiver), CONFISCATE);
                        });
                        it("second receiver", async () => {
                          assert.equal(await this.mock.balanceOf(anotherReceiver), CONFISCATE);
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
});
