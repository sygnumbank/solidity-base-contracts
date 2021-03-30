const BaseOperators = artifacts.require("BaseOperators");
const BlockerOperators = artifacts.require("BlockerOperators");
const RaiseOperators = artifacts.require("RaiseOperators");
const TraderOperators = artifacts.require("TraderOperators");
const Whitelist = artifacts.require("Whitelist");
const OnboardRouter = artifacts.require("OnboardRouter");

const {
  BASE_OPERATORS_CONTRACT_ADDRESS,
  BLOCKER_OPERATORS_CONTRACT_ADDRESS,
  RAISE_OPERATORS_CONTRACT_ADDRESS,
  TRADER_OPERATORS_CONTRACT_ADDRESS,
  WHITELIST_CONTRACT_ADDRESS,
  ADMIN_ADDRESS,
  EMPTY_ADDRESS,
} = require("../../config/deployment");

module.exports = async (deployer) => {
  // if(BASE_OPERATORS_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.baseOperatorsRaw = await deployer.deploy(BaseOperators, ADMIN_ADDRESS)
  //     this.baseOperators = this.baseOperatorsRaw.address
  // } else {
  //     this.baseOperators = BASE_OPERATORS_CONTRACT_ADDRESS
  // }
  // if(BLOCKER_OPERATORS_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.blockerOperatorsRaw = await deployer.deploy(BlockerOperators)
  //     this.blockerOperators = this.blockerOperatorsRaw.address
  // } else {
  //     this.blockerOperators = BLOCKER_OPERATORS_CONTRACT_ADDRESS
  // }
  // if(RAISE_OPERATORS_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.raiseOperatorsRaw = await deployer.deploy(RaiseOperators)
  //     this.raiseOperators = this.raiseOperatorsRaw.address
  // } else {
  //     this.raiseOperators = RAISE_OPERATORS_CONTRACT_ADDRESS
  // }
  // if(TRADER_OPERATORS_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.traderOperatorsRaw = await deployer.deploy(TraderOperators)
  //     this.traderOperators = this.traderOperatorsRaw.address
  // } else {
  //     this.traderOperators = TRADER_OPERATORS_CONTRACT_ADDRESS
  // }
  // if(WHITELIST_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.whitelistRaw = await deployer.deploy(Whitelist)
  //     this.whitelist = this.whitelistRaw.address
  // } else {
  //     this.whitelist = WHITELIST_CONTRACT_ADDRESS
  // }
  // this.onboardRouter = await deployer.deploy(OnboardRouter)
  // await this.onboardRouter.initialize(this.whitelist, this.baseOperators, this.raiseOperators, this.traderOperators, this.blockerOperators)
};
