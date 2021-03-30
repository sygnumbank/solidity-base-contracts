const BaseOperators = artifacts.require("BaseOperators");
const Whitelist = artifacts.require("Whitelist");

const { BASE_OPERATORS_CONTRACT_ADDRESS, ADMIN_ADDRESS, EMPTY_ADDRESS } = require("../../config/deployment");

module.exports = async (deployer) => {
  // if(BASE_OPERATORS_CONTRACT_ADDRESS == EMPTY_ADDRESS){
  //     this.baseOperatorsRaw = await deployer.deploy(BaseOperators, ADMIN_ADDRESS)
  //     this.baseOperators = this.baseOperatorsRaw.address
  // } else {
  //     this.baseOperators = BASE_OPERATORS_CONTRACT_ADDRESS
  // }
  // this.whitelist = await deployer.deploy(Whitelist)
  // await this.whitelist.initialize(this.baseOperators)
};
