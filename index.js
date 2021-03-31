const TruffleContract = require("@truffle/contract");
const { THREE_HUNDRED_ADDRESS, THREE_HUNDRED_NUMBERS } = require("./test/threeHundred");

const operatorableJson = require("./build/contracts/Operatorable.json");
const baseOperatorsJson = require("./build/contracts/BaseOperators.json");
const raiseOperatorsJson = require("./build/contracts/RaiseOperators.json");
const blockerOperatorsJson = require("./build/contracts/BlockerOperators.json");
const traderOperatorsJson = require("./build/contracts/TraderOperators.json");
const whitelistJson = require("./build/contracts/Whitelist.json");
const sygnumProxyJson = require("./build/contracts/SygnumProxy.json");
const ERC20Json = require("./build/contracts/ERC20.json");

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
