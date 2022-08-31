[Mirrored from our internal VCS @ commit hash c7120ae95b96eeda1b908dc837ef1226632d937f]

# Solidity-Base-Contracts

**Secure foundation smart contracts used by other Sygnum contracts.** Built on a solid foundation of community-vetted code, utilizing [OpenZeppelin industry standards](https://github.com/OpenZeppelin/openzeppelin-contracts).

- Admin, Operator, System, Multisig, Relay, Investor, Issuer, Trader and Blocker [role-based permissioning](contracts/role) scheme.
- Reusable [Solidity components](contracts/helpers) to build custom contracts and complex decentralized systems.
- Audited by [Quantstamp](https://quantstamp.com/) with no major findings.

[![coverage report](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/badges/master/coverage.svg)](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/-/commits/master)

## Overview

Note: for now this repo only works with NodeJS 16.

To use Node Version Manager (nvm), this repo has a .nvmrc file.

```console
nvm use

# Only required if specified node version is not installed
nvm install
```

### Installation

Obtain a [gitlab access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html). Using the `api` scope should suffice.

```console
# Set URL for your scoped packages.
# For example package with name `@sygnum/solidity-base-contracts` will use this URL for download
npm config set @sygnum:registry https://gitlab.com/api/v4/packages/npm/

# Add the token for the scoped packages URL. This will allow you to download
# `@sygnum/` packages from private projects.
npm config set '//gitlab.com/api/v4/packages/npm/:_authToken' "<your_access_token>"
```

Now you are able to install and use all private npm packages within the @sygnum gitlab org.

```console
npm i --save-dev @sygnum/solidity-base-contracts
```

### Usage

Once installed, you can use the contracts in the library by importing them:

```solidity
pragma solidity 0.8.8;

import "@sygnum/solidity-base-contracts/contracts/role/base/Operatorable.sol";
import "@sygnum/solidity-base-contracts/contracts/helpers/Pausable.sol";

contract MyContract is Operatorable, Pausable {
  constructor() public {}
}

```

To keep your system secure, you should **always** use the installed code as-is, and neither copy-paste it from online sources, nor modify it yourself. The library is designed so that only the contracts and functions you use are deployed, so you don't need to worry about it needlessly increasing gas costs.

To use and deploy the contracts from another Truffle project, the `load(provider)` function should be used, as demonstrated here:

```javascript
const SolidityBaseContracts = require("@sygnum/solidity-base-contracts");
const TestContract = artifacts.require("Test");
const { BaseOperators } = SolidityBaseContracts.load(
  TestContract.currentProvider
);

contract("Contrived test contract", async ([admin]) => {
  it("Should be able to deploy Sygnum BaseOperators and log information about it", async () => {
    this.baseOperators = await BaseOperators.new(admin, { from: admin });
    console.log(this.baseOperators.address);
    console.log(BaseOperators.currentProvider);
  });

  // more tests which set up base operators & allow TestContract to interact with it.
});
```

To use and interact with the contracts from another JavaScript/backend application, contract ABIs should be loaded manually and instantiated using your Ethereum library of choice (Web3.js shown here):

```javascript
const Web3 = require("web3");
const baseOperatorsAbi =
  require("@sygnum/solidity-base-contracts/build/contracts/BaseOperators.json").abi;

let web3 = new Web3("http://localhost:8545");
var baseOperatorsDeployedAddress = "0x...";
var baseOperatorsInstance = new web3.eth.Contract(
  baseOperatorsAbi,
  baseOperatorsDeployedAddress
);
// interact with the contract
```

### Testing

First, install all required packages:  
`npm install`

Then run:
`npx hardhat test`

### Deploying

First, install all required packages:  
`npm install`

**hardhat-deploy**

To deploy on Goerli testnet:  
`npx hardhat deploy --network goerli`  
Or, to deploy on mainnet:
`npx hardhat deploy --network mainnet`

**Truffle Migrations**

To deploy on Goerli testnet:  
`npx truffle migrate --network goerli`  
Or, to deploy on mainnet:
`npx truffle migrate --network mainnet`

**Note**: you need to populate a `.env` file based on the `.env.example` file.

## Security

This project is maintained by [Sygnum](https://www.sygnum.com/), and developed following our high standards for code quality and security. We take no responsibility for your implementation decisions and any security problems you might experience.

The latest audit was done on November 2020 at commit hash 37ce7e58.

Please report any security issues you find to team3301@sygnum.com.

## Solidity UML:

Solidity UML diagrams can be found in the artifacts associated with the latest successful execution of the "solidity-uml" job in the pipeline.

## Addresses:

Smart contract addresses for dev/test/production can be found [on Confluence](https://sygnum.atlassian.net/wiki/spaces/BR/pages/500563997/Tokenization+Smart+Contracts).

## Audit Info

This is the root repo that is inherited by all the other repositories, and includes contracts that are used across multiple different repos. By following this pattern, we ensure that we do not unecessarily re-write and re-test contracts throughout the repos.

#### Folders to include

[contracts/helpers/\*](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/develop/contracts/helpers/) \*_Apart from [contracts/helpers/ERC20/ERC20Overload](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/develop/contracts/helpers/ERC20/ERC20Overload)
[contracts/role/_](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/develop/contracts/role/)  
[contracts/routers/\*](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/develop/contracts/routers/)

#### Folders to exclude

[contracts/mocks/\*](https://gitlab.com/sygnum/blockchain-engineering/ethereum/solidity-base-contracts/develop/contracts/mocks/)

#### Misc

We had to create an underlying modification to the ERC20 standard to be able to modify interactions with `_balances` in another contract. Change from `private` to `internal`. The diff can be seen on [https://www.diffchecker.com/BhSzkpqA](https://www.diffchecker.com/BhSzkpqA). Imo there is no need to actually audit this contract all over again, but the audit report should highlight the modification from `private` to `internal`. This is a regulatory requirement, whereby the actual tokens cannot be moved from the underlying users balance, and should be still associated to this address. Initially, we had done an escrow contract for these but this was revoked by the regulators so this is the justification behind this modification.
