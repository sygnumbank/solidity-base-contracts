const { expectRevert, InitializableMock } = require("../common");

contract("Initializable", ([admin]) => {
  beforeEach("deployment", async () => {
    this.mock = await InitializableMock.new({ from: admin });
  });
  describe("before initialization", () => {
    it("initializer has not ran", async () => {
      assert.equal(await this.mock.initializerRan(), false);
    });
    describe("initialization", () => {
      beforeEach(async () => {
        await this.mock.initialize();
      });
      it("initializer has ran", async () => {
        assert.equal(await this.mock.initializerRan(), true);
      });
      describe("non-functional", () => {
        it("revert re-initializing", async () => {
          await expectRevert(this.mock.initialize(), "InitializableContractAlreadyInitialized()");
        });
        it("revert nested re-initialization", async () => {
          await expectRevert(this.mock.initializeNested(), "InitializableContractAlreadyInitialized()");
        });
      });
    });
    describe("nested initialization", () => {
      beforeEach(async () => {
        await this.mock.initializeNested();
      });
      it("initializer has ran", async () => {
        assert.equal(await this.mock.initializerRan(), true);
      });
    });
  });
});
