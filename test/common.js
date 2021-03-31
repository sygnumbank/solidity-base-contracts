const { BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { ethers } = require("ethers");
const { encodeCall } = require("@openzeppelin/upgrades");
const { THREE_HUNDRED_ADDRESS, THREE_HUNDRED_NUMBERS, TWO_IDENTIFIER } = require("./threeHundred");
const { getAdmin, getImplementation, assertRevert } = require("./tools");

const { ZERO_ADDRESS } = constants;
const BigNumber = ethers.utils.bigNumberify;

/* helpers */
const Freezable = artifacts.require("Freezable");
const Initializable = artifacts.require("Initializable");
const Pausable = artifacts.require("Pausable");
const Whitelist = artifacts.require("Whitelist");
const SygnumProxy = artifacts.require("SygnumProxy");
const TradingPairWhitelist = artifacts.require("TradingPairWhitelist");
/* ├──/ERC20/ */
const ERC20Burnable = artifacts.require("ERC20Burnable");
const ERC20Destroyable = artifacts.require("ERC20Destroyable");
const ERC20Freezable = artifacts.require("ERC20Freezable");
const ERC20Mintable = artifacts.require("ERC20Mintable");
const ERC20Pausable = artifacts.require("ERC20Pausable");
const ERC20Whitelist = artifacts.require("ERC20Whitelist");
/* ├──/instance/ */
const Whitelistable = artifacts.require("Whitelistable");

/* mocks */
/* └──/helpers/ */
const FreezableMock = artifacts.require("FreezableMock");
const InitializableMock = artifacts.require("InitializableMock");
const SampleMother = artifacts.require("SampleMother");
const SampleGramps = artifacts.require("SampleGramps");
const SampleFather = artifacts.require("SampleFather");
const SampleChild = artifacts.require("SampleChild");
const PausableMock = artifacts.require("PausableMock");
const TradingPairWhitelistMock = artifacts.require("TradingPairWhitelistMock");
const WhitelistMock = artifacts.require("WhitelistMock");
/*       └── instance */
const WhitelistableMock = artifacts.require("WhitelistableMock");
/*       └── ERC20 */
const ERC20BlockableMock = artifacts.require("ERC20BlockableMock");
const ERC20BurnableMock = artifacts.require("ERC20BurnableMock");
const ERC20ConfiscatableMock = artifacts.require("ERC20ConfiscatableMock");
const ERC20DestroyableMock = artifacts.require("ERC20DestroyableMock");
const ERC20FreezableMock = artifacts.require("ERC20FreezableMock");
const ERC20MintableMock = artifacts.require("ERC20MintableMock");
const ERC20PausableMock = artifacts.require("ERC20PausableMock");
const ERC20SnapshotMock = artifacts.require("ERC20SnapshotMock");
const ERC20TradeableMock = artifacts.require("ERC20TradeableMock");
const ERC20WhitelistMock = artifacts.require("ERC20WhitelistMock");
/* └──/role/
        └──base/ */
const OperatorableMock = artifacts.require("OperatorableMock");
/*          └──multisig/ */
const MultisigMock = artifacts.require("MultisigMock");
/*          └──relay/ */
const RelayerContractMock = artifacts.require("RelayerContractMock");
/*      └──blocker/ */
const BlockerContractMock = artifacts.require("BlockerContractMock");
const BlockerOperatorableMock = artifacts.require("BlockerOperatorableMock");
/*      └──raise/ */
const RaiseOperatorableMock = artifacts.require("RaiseOperatorableMock");
/*      └──trader/ */
const TraderOperatorableMock = artifacts.require("TraderOperatorableMock");

/* role */
/* └──/base/ */
const BaseOperators = artifacts.require("BaseOperators");
const Operatorable = artifacts.require("Operatorable");
/* └──/blocker/ */
const BlockerOperators = artifacts.require("BlockerOperators");
const BlockerOperatorable = artifacts.require("BlockerOperatorable");
/* └──/raise/ */
const RaiseOperators = artifacts.require("RaiseOperators");
const RaiseOperatorable = artifacts.require("RaiseOperatorable");
/* └──/raise/ */
const TraderOperators = artifacts.require("TraderOperators");
const TraderOperatorable = artifacts.require("TraderOperatorable");

/* routers */
const OnboardRouter = artifacts.require("OnboardRouter");
const InitializeRouter = artifacts.require("InitializeRouter");

const newBool = true;
const newUint = 5;
const MINT = 50;
const BURN = 5;
const TRANSFER = 5;
const BLOCK = 5;
const APPROVAL = 5;
const CONFISCATE = 5;

const TWO_ADDRESSES = ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb49", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb42"];

module.exports = {
  BN,
  BigNumber,
  constants,
  encodeCall,
  getAdmin,
  getImplementation,
  assertRevert,
  expectEvent,
  expectRevert,
  ZERO_ADDRESS,
  Freezable,
  Initializable,
  Pausable,
  Whitelist,
  SygnumProxy,
  TradingPairWhitelist,
  ERC20Burnable,
  ERC20Destroyable,
  ERC20Freezable,
  ERC20Mintable,
  ERC20Pausable,
  ERC20Whitelist,
  Whitelistable,
  InitializableMock,
  SampleMother,
  SampleGramps,
  SampleFather,
  SampleChild,
  PausableMock,
  FreezableMock,
  WhitelistMock,
  WhitelistableMock,
  ERC20BurnableMock,
  ERC20ConfiscatableMock,
  ERC20DestroyableMock,
  ERC20FreezableMock,
  ERC20MintableMock,
  ERC20PausableMock,
  ERC20SnapshotMock,
  ERC20WhitelistMock,
  ERC20BlockableMock,
  ERC20TradeableMock,
  OperatorableMock,
  RaiseOperatorableMock,
  TraderOperatorableMock,
  RelayerContractMock,
  MultisigMock,
  BlockerOperatorableMock,
  BlockerContractMock,
  TradingPairWhitelistMock,
  BaseOperators,
  Operatorable,
  RaiseOperators,
  RaiseOperatorable,
  TraderOperators,
  TraderOperatorable,
  BlockerOperators,
  BlockerOperatorable,
  OnboardRouter,
  InitializeRouter,
  TWO_ADDRESSES,
  newBool,
  newUint,
  MINT,
  BURN,
  TRANSFER,
  BLOCK,
  APPROVAL,
  CONFISCATE,
  THREE_HUNDRED_ADDRESS,
  THREE_HUNDRED_NUMBERS,
  TWO_IDENTIFIER,
};
