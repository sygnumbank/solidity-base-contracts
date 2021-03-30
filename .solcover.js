module.exports = {
  port: 8545,
  providerOptions: {
    total_accounts: 20,
    default_balance_ether: 1000
  },
  skipFiles: ['Migrations.sol', 'routers/InitializeRouter.sol', 'helpers/ERC20/ERC20Overload/ERC20.sol', 'libraries/Bytes32Set.sol'],
};