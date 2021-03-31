const BaseOperators = artifacts.require("BaseOperators");
const BlockerOperators = artifacts.require("BlockerOperators");
const RaiseOperators = artifacts.require("RaiseOperators");
const TraderOperators = artifacts.require("TraderOperators");
const Whitelist = artifacts.require("Whitelist");
const OnboardRouter = artifacts.require("OnboardRouter");

const { ADMIN_ADDRESS } = require("../config/deployment");

module.exports = async (deployer) => {
  // Deploy Operators
  await deployer.deploy(BaseOperators, ADMIN_ADDRESS);
  await deployer.deploy(BlockerOperators);
  await deployer.deploy(TraderOperators);
  await deployer.deploy(RaiseOperators);

  this.baseOperators = await BaseOperators.deployed();
  this.blockerOperators = await BlockerOperators.deployed();
  this.traderOperators = await TraderOperators.deployed();
  this.raiseOperators = await RaiseOperators.deployed();

  // Initialize
  await this.blockerOperators.initialize(this.baseOperators.address);
  await this.traderOperators.initialize(this.baseOperators.address);
  await this.raiseOperators.initialize(this.baseOperators.address);

  await deployer.deploy(Whitelist);
  this.whitelist = await Whitelist.deployed();
  await this.whitelist.initialize(this.baseOperators.address);

  await deployer.deploy(OnboardRouter);
  this.onboardRouter = await OnboardRouter.deployed();
  await this.onboardRouter.initialize(
    this.whitelist.address,
    this.baseOperators.address,
    this.raiseOperators.address,
    this.traderOperators.address,
    this.blockerOperators.address
  );
};
