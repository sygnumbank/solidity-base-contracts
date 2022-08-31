/* eslint-disable no-await-in-loop */

const { ethers } = require("hardhat");
const { ADMIN_ADDRESS } = require("../config/deployment");
require("dotenv").config();

const BaseOperators = "BaseOperators";
const BlockerOperators = "BlockerOperators";
const RaiseOperators = "RaiseOperators";
const TraderOperators = "TraderOperators";
const Whitelist = "Whitelist";
const OnboardRouter = "OnboardRouter";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigners();

  const deployingGasAmount = Number(process.env.DEPLOYING_GAS_AMOUNT);
  const confirmations = Number(process.env.CONFIRMATIONS);

  console.log(`Deploying Account Address: ${deployer}`);

  const baseOperatorsDeployment = await deploy(BaseOperators, {
    from: deployer,
    gasLimit: deployingGasAmount,
    args: [ADMIN_ADDRESS],
    log: true,
  });

  if (baseOperatorsDeployment.transactionHash) {
    await ethers.provider.waitForTransaction(baseOperatorsDeployment.transactionHash, confirmations);
  }

  const _address = {};

  // Deploying the multiple contracts together in this loop
  // eslint-disable-next-line no-restricted-syntax
  for (const contractName of [BlockerOperators, TraderOperators, RaiseOperators, Whitelist]) {
    const contractArtifact = await ethers.getContractFactory(contractName, signer[0]);

    const deployment = await deploy(contractName, {
      from: deployer,
      gasLimit: deployingGasAmount,
      log: true,
    });

    if (deployment.transactionHash) {
      await ethers.provider.waitForTransaction(deployment.transactionHash, confirmations);
    }

    _address[contractName] = deployment.address;

    const contractInstance = await contractArtifact.attach(deployment.address);

    try {
      const baseOperatorsTx = await contractInstance.initialize(baseOperatorsDeployment.address);
      await baseOperatorsTx.wait();
    } catch (e) {
      console.log(e);
    }
  }

  // Deploy the OnboardRouter contract address
  const onboardRouterDeployment = await deploy(OnboardRouter, {
    from: deployer,
    gasLimit: deployingGasAmount,
    log: true,
  });

  if (onboardRouterDeployment.transactionHash) {
    await ethers.provider.waitForTransaction(onboardRouterDeployment.transactionHash, confirmations);
  }

  // initializing the OnboardRouter contract
  const onboardRouterArtifact = await ethers.getContractFactory(OnboardRouter);
  const onboardRouterInstance = await onboardRouterArtifact.attach(onboardRouterDeployment.address);

  try {
    onboardRouterInstance["initialize(address,address,address,address,address)"](
      _address[Whitelist],
      baseOperatorsDeployment.address,
      _address[RaiseOperators],
      _address[TraderOperators],
      _address[BlockerOperators]
    );
  } catch (e) {
    console.log(e);
  }

  console.table({
    BaseOperators: baseOperatorsDeployment.address,
    RaiseOperators: _address[RaiseOperators],
    TraderOperators: _address[TraderOperators],
    BlockerOperators: _address[BlockerOperators],
    Whitelist: _address[Whitelist],
    OnboardRouter: onboardRouterDeployment.address,
  });
};

module.exports.tags = ["All"];
