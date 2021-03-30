/* eslint-disable no-await-in-loop */
const { ERC20SnapshotMock, MINT } = require("../../common");

contract("ERC20Snapshot", ([user, receiver, other]) => {
  beforeEach("deployment", async () => {
    this.mock = await ERC20SnapshotMock.new();
    this.iterations = 5;
  });

  context("deployed", () => {
    describe("outstanding entries", () => {
      it("value at 0", async () => {
        assert.equal(await this.mock.totalSupplyAt(0), 0, "if option does not enter");
      });
    });
    describe("mint", () => {
      beforeEach(async () => {
        this.blockNum = [];
        for (let i = 0; i < this.iterations; i++) {
          this.blockNum.push(await web3.eth.getBlockNumber());
          await this.mock.mint(user, MINT);
        }
      });
      it("total supply updated", async () => {
        assert.equal(await this.mock.totalSupplyAt(this.blockNum[1]), MINT, "total supply not updated");
      });
      it("snapshot balance updated", async () => {
        for (let j = 0; j < this.iterations; j++) {
          assert.equal(await this.mock.balanceOfAt(user, this.blockNum[j]), j * MINT, "balance not updated");
        }
      });
      it("value greater than length", async () => {
        assert.equal(await this.mock.totalSupplyAt(this.blockNum[4] * this.blockNum[4]), this.iterations * MINT, "if option does not enter");
      });
      describe("transfer", () => {
        beforeEach(async () => {
          this.blockNum = [];
          for (let i = 0; i < this.iterations; i++) {
            this.blockNum.push(await web3.eth.getBlockNumber());
            await this.mock.transfer(receiver, MINT, { from: user });
          }
        });
        it("receiver and sender balance updated", async () => {
          for (let k = 0; k < this.iterations; k++) {
            assert.equal(await this.mock.balanceOfAt(receiver, this.blockNum[k]), k * MINT, "balance receiver not updated");
            assert.equal(await this.mock.balanceOfAt(user, this.blockNum[k]), this.iterations * MINT - k * MINT, "balance user not updated");
          }
        });
      });
      describe("confiscate", async () => {
        beforeEach(async () => {
          this.blockNum = [];
          for (let k = 0; k < this.iterations; k++) {
            this.blockNum.push(await web3.eth.getBlockNumber());
            await this.mock.confiscate(user, receiver, MINT, { from: other });
          }
        });
        it("receiver and sender balance updated", async () => {
          for (let l = 0; l < this.iterations; l++) {
            assert.equal(await this.mock.balanceOfAt(receiver, this.blockNum[l]), l * MINT, "balance other not updated");
            assert.equal(await this.mock.balanceOfAt(user, this.blockNum[l]), this.iterations * MINT - l * MINT, "balance user not updated");
          }
        });
      });
      describe("burn", async () => {
        beforeEach(async () => {
          this.blockNum = [];
          for (let k = 0; k < this.iterations; k++) {
            this.blockNum.push(await web3.eth.getBlockNumber());
            await this.mock.burn(MINT, { from: user });
          }
        });
        it("user balance updated", async () => {
          for (let l = 0; l < this.iterations; l++) {
            assert.equal(await this.mock.balanceOfAt(user, this.blockNum[l]), this.iterations * MINT - l * MINT, "balance user not updated");
          }
        });
      });
      describe("burnFor", async () => {
        beforeEach(async () => {
          this.blockNum = [];
          for (let k = 0; k < this.iterations; k++) {
            this.blockNum.push(await web3.eth.getBlockNumber());
            await this.mock.burnFor(user, MINT);
          }
        });
        it("user balance updated", async () => {
          for (let l = 0; l < this.iterations; l++) {
            assert.equal(await this.mock.balanceOfAt(user, this.blockNum[l]), this.iterations * MINT - l * MINT, "balance user not updated");
          }
        });
      });
      describe("approve", async () => {
        beforeEach(async () => {
          this.blockNum = [];
          for (let i = 0; i < this.iterations; i++) {
            this.blockNum.push(await web3.eth.getBlockNumber());
            await this.mock.increaseAllowance(receiver, MINT, { from: user });
          }
        });
        it("allowance updated", async () => {
          assert.equal(await this.mock.allowance(user, receiver), MINT * this.iterations, "allowance not updated");
        });
        describe("transferFrom", async () => {
          beforeEach(async () => {
            this.blockNum = [];
            for (let k = 0; k < this.iterations; k++) {
              this.blockNum.push(await web3.eth.getBlockNumber());
              await this.mock.transferFrom(user, other, MINT, { from: receiver });
            }
          });
          it("receiver and sender balance updated", async () => {
            for (let l = 0; l < this.iterations; l++) {
              assert.equal(await this.mock.balanceOfAt(other, this.blockNum[l]), l * MINT, "balance other not updated");
              assert.equal(await this.mock.balanceOfAt(user, this.blockNum[l]), this.iterations * MINT - l * MINT, "balance user not updated");
            }
          });
        });
        describe("burnFrom", async () => {
          beforeEach(async () => {
            this.blockNum = [];
            for (let k = 0; k < this.iterations; k++) {
              this.blockNum.push(await web3.eth.getBlockNumber());
              await this.mock.burnFrom(user, MINT, { from: receiver });
            }
          });
          it("receiver and sender balance updated", async () => {
            for (let l = 0; l < this.iterations; l++) {
              assert.equal(await this.mock.balanceOfAt(user, this.blockNum[l]), this.iterations * MINT - l * MINT, "balance user not updated");
            }
          });
        });
      });
    });
  });
});
/* eslint-enable no-await-in-loop */
