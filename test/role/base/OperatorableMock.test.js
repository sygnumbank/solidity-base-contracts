const { expectRevert, expectEvent, BaseOperators, OperatorableMock, RelayerContractMock } = require("../../common");

contract("OperatorableMock", ([admin, operator, system, multisig, attacker]) => {
  beforeEach("deployment", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    this.operatorableMock = await OperatorableMock.new({ from: admin });

    this.relayerContractMock = await RelayerContractMock.new({ from: admin });

    await this.operatorableMock.setContract(this.baseOperators.address);
  });

  context("mock initialization", () => {
    beforeEach(async () => {
      await this.baseOperators.addOperator(operator, { from: admin });
      await this.baseOperators.addSystem(system, { from: admin });
      await this.baseOperators.addMultisig(multisig, { from: admin });
      await this.baseOperators.addRelay(this.relayerContractMock.address, { from: admin });
    });
    context("operator action", () => {
      describe("non-functional", () => {
        it("reverts when not operator", async () => {
          await expectRevert(this.operatorableMock.operatorAction({ from: attacker }), "OperatorableCallerNotOperator()");
        });
      });
      describe("functional", () => {
        describe("when operator", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorAction({ from: operator });
          });
          it("operator action set", async () => {
            assert.equal(await this.operatorableMock.OperatorAction(), true);
          });
        });
      });
    });

    describe("system action", () => {
      describe("non-functional", () => {
        it("reverts when not system", async () => {
          await expectRevert(this.operatorableMock.systemAction({ from: attacker }), "OperatorableCallerNotSystem()");
        });
      });
      describe("functional", () => {
        describe("when system", () => {
          beforeEach(async () => {
            await this.operatorableMock.systemAction({ from: system });
          });
          it("system action set", async () => {
            assert.equal(await this.operatorableMock.SystemAction(), true);
          });
        });
      });
    });

    describe("relay action", () => {
      describe("non-functional", () => {
        it("reverts when not relay", async () => {
          await expectRevert(this.operatorableMock.relayAction({ from: attacker }), "OperatorableCallerNotRelay()");
        });
      });
      describe("functional", () => {
        it("relayer event emitted", async () => {
          const { tx } = await this.relayerContractMock.callContractRelayAction(this.operatorableMock.address);
          expectEvent.inTransaction(tx, this.operatorableMock, "RelayerCalled", { caller: this.relayerContractMock.address, action: true });
        });
      });
    });

    describe("multisig action", () => {
      describe("non-functional", () => {
        it("reverts when not multisig", async () => {
          await expectRevert(this.operatorableMock.multisigAction({ from: attacker }), "OperatorableCallerNotMultisig()");
        });
      });
      describe("functional", () => {
        describe("when multisig", () => {
          beforeEach(async () => {
            await this.operatorableMock.multisigAction({ from: multisig });
          });
          it("multisig action set", async () => {
            assert.equal(await this.operatorableMock.MultisigAction(), true);
          });
        });
      });
    });

    describe("admin or system action", () => {
      describe("non-functional", () => {
        it("reverts when not system nor admin", async () => {
          await expectRevert(this.operatorableMock.adminOrSystemAction({ from: attacker }), "OperatorableCallerNotAdminOrSystem()");
        });
      });
      describe("functional", () => {
        describe("when system", () => {
          beforeEach(async () => {
            await this.operatorableMock.adminOrSystemAction({ from: system });
          });
          it("admin or system action set", async () => {
            assert.equal(await this.operatorableMock.AdminOrSystemAction(), true);
          });
        });
        describe("when admin", () => {
          beforeEach(async () => {
            await this.operatorableMock.adminOrSystemAction({ from: admin });
          });
          it("admin or system action set", async () => {
            assert.equal(await this.operatorableMock.AdminOrSystemAction(), true);
          });
        });
      });
    });

    describe("operator or system action", () => {
      describe("non-functional", () => {
        it("reverts when not operator nor system", async () => {
          await expectRevert(this.operatorableMock.operatorOrSystemAction({ from: attacker }), "OperatorableCallerNotOperatorOrSystem()");
        });
      });
      describe("functional", () => {
        describe("when operator", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorOrSystemAction({ from: operator });
          });
          it("operator or system action set", async () => {
            assert.equal(await this.operatorableMock.OperatorOrSystemAction(), true);
          });
        });
        describe("when system", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorOrSystemAction({ from: system });
          });
          it("operator or system action set", async () => {
            assert.equal(await this.operatorableMock.OperatorOrSystemAction(), true);
          });
        });
      });
    });

    describe("operator or relay action", () => {
      describe("non-functional", () => {
        it("reverts when not operator nor system", async () => {
          await expectRevert(this.operatorableMock.operatorOrRelayAction({ from: attacker }), "OperatorableCallerNotOperatorOrRelay()");
        });
      });
      describe("functional", () => {
        describe("when operator", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorOrRelayAction({ from: operator });
          });
          it("operator or relay action set", async () => {
            assert.equal(await this.operatorableMock.OperatorOrRelayAction(), true);
          });
        });
        describe("when relay", () => {
          it("relayer event emitted", async () => {
            const { tx } = await this.relayerContractMock.callContractOperatorOrRelayAction(this.operatorableMock.address);
            expectEvent.inTransaction(tx, this.operatorableMock, "RelayerCalled", { caller: this.relayerContractMock.address, action: true });
          });
        });
      });
    });
    describe("admin or relay action", () => {
      describe("non-functional", () => {
        it("reverts when not operator nor system", async () => {
          await expectRevert(this.operatorableMock.adminOrRelayAction({ from: attacker }), "OperatorableCallerNotAdminOrRelay()");
        });
      });
      describe("functional", () => {
        describe("when admin", () => {
          beforeEach(async () => {
            await this.operatorableMock.adminOrRelayAction({ from: admin });
          });
          it("admin or relay action set", async () => {
            assert.equal(await this.operatorableMock.AdminOrRelayAction(), true);
          });
        });
        describe("when relay", () => {
          it("relayer event emitted", async () => {
            const { tx } = await this.relayerContractMock.callContractAdminOrRelayAction(this.operatorableMock.address);
            expectEvent.inTransaction(tx, this.operatorableMock, "RelayerCalled", { caller: this.relayerContractMock.address, action: true });
          });
        });
      });
    });
    describe("operator or system or relay action", () => {
      describe("non-functional", () => {
        it("reverts when not operator nor system nor relay", async () => {
          await expectRevert(this.operatorableMock.operatorOrSystemOrRelayAction({ from: attacker }), "OperatorableCallerNotOperatorOrSystemOrRelay()");
        });
      });
      describe("functional", () => {
        describe("when relay", () => {
          it("relay event emitted", async () => {
            const { tx } = await this.relayerContractMock.callContractOperatorOrSystemOrRelayAction(this.operatorableMock.address);
            expectEvent.inTransaction(tx, this.operatorableMock, "RelayerCalled", { caller: this.relayerContractMock.address, action: true });
          });
        });
        describe("when system", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorOrSystemOrRelayAction({ from: system });
          });
          it("operator or system or relay action set", async () => {
            assert.equal(await this.operatorableMock.OperatorOrSystemOrRelayAction(), true);
          });
        });
        describe("when operator", () => {
          beforeEach(async () => {
            await this.operatorableMock.operatorOrSystemOrRelayAction({ from: operator });
          });
          it("operator or system or relay action set", async () => {
            assert.equal(await this.operatorableMock.OperatorOrSystemOrRelayAction(), true);
          });
        });
      });
    });
  });
});
