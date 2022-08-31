const TruffleContract = require("@truffle/contract");
const { THREE_HUNDRED_ADDRESS, THREE_HUNDRED_NUMBERS } = require("./test/threeHundred");

/* eslint-disable import/no-unresolved */
const operatorableJson = require("./artifacts/contracts/role/base/Operatorable.sol/Operatorable.json");
const baseOperatorsJson = require("./artifacts/contracts/role/base/BaseOperators.sol/BaseOperators.json");
const raiseOperatorsJson = require("./artifacts/contracts/role/raise/RaiseOperators.sol/RaiseOperators.json");
const blockerOperatorsJson = require("./artifacts/contracts/role/blocker/BlockerOperators.sol/BlockerOperators.json");
const traderOperatorsJson = require("./artifacts/contracts/role/trader/TraderOperators.sol/TraderOperators.json");
const whitelistJson = require("./artifacts/contracts/helpers/Whitelist.sol/Whitelist.json");
const sygnumProxyJson = require("./artifacts/contracts/helpers/SygnumProxy.sol/SygnumProxy.json");
const ERC20Json = require("./artifacts/contracts/helpers/ERC20/ERC20Overload/ERC20.sol/ERC20.json");
/* eslint-enable import/no-unresolved */

const MINT = 50;
const BURN = 5;
const TRANSFER = 5;
const BLOCK = 5;
const APPROVAL = 5;
const CONFISCATE = 5;

module.exports = {
  load: (provider) => {
    const contracts = {
      BaseOperators: TruffleContract(baseOperatorsJson),
      RaiseOperators: TruffleContract(raiseOperatorsJson),
      BlockerOperators: TruffleContract(blockerOperatorsJson),
      TraderOperators: TruffleContract(traderOperatorsJson),
      SygnumProxy: TruffleContract(sygnumProxyJson),
      Whitelist: TruffleContract(whitelistJson),
      ERC20: TruffleContract(ERC20Json),
      Operatorable: TruffleContract(operatorableJson),
    };
    Object.values(contracts).forEach((i) => i.setProvider(provider));
    return contracts;
  },
  MINT,
  BURN,
  TRANSFER,
  BLOCK,
  APPROVAL,
  CONFISCATE,
  THREE_HUNDRED_ADDRESS,
  THREE_HUNDRED_NUMBERS,
};
