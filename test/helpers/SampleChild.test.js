const { SampleChild } = require("../common");

contract("SampleChild", ([admin]) => {
  describe("inheritance testing", () => {
    const mother = 12;
    const gramps = 56;
    const father = 34;
    const child = 78;
    beforeEach(async () => {
      this.sample = await SampleChild.new({ from: admin });
    });
    describe("initialized", () => {
      beforeEach(async () => {
        await this.sample.initialize(mother, gramps, father, child);
      });
      it("human initialized", async () => {
        assert.equal(await this.sample.isHuman(), true);
      });
      it("mother initialized", async () => {
        assert.equal(await this.sample.mother(), mother);
      });
      it("gramps initialized", async () => {
        assert.equal(await this.sample.gramps(), gramps);
      });
      it("father initialized", async () => {
        assert.equal(await this.sample.father(), father);
      });
      it("child initialized", async () => {
        assert.equal(await this.sample.child(), child);
      });
    });
  });
});
