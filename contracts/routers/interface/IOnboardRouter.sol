/**
 * @title IOnboardRouter
 * @notice Interface for OnboardRouter contract
 */

pragma solidity ^0.8.0;

abstract contract IOnboardRouter {
    function isWhitelisted(address _account, address _whitelist) external virtual returns (bool);

    function onboardSystem(address _account, address _whitelist) external virtual;

    function deboardSystem(address _account, address _whitelist) external virtual;

    function onboardSuperAdmin(address _account, address _whitelist) external virtual;

    function deboardSuperAdmin(address _account, address _whitelist) external virtual;

    function onboardInvestor(address _account, address _whitelist) external virtual;

    function deboardInvestor(address _account, address _whitelist) external virtual;

    function onboardTrader(address _account, address _whitelist) external virtual;

    function deboardTrader(address _account, address _whitelist) external virtual;

    function onboardBlocker(address _account, address _whitelist) external virtual;

    function deboardBlocker(address _account, address _whitelist) external virtual;

    function changeAdminToTrader(address _account, address _whitelist) external virtual;

    function changeAdminToSuperAdmin(address _account, address _whitelist) external virtual;

    function changeOperatorToTrader(address _account, address _whitelist) external virtual;

    function changeOperatorToSuperAdmin(address _account, address _whitelist) external virtual;

    function changeTraderToAdmin(address _account, address _whitelist) external virtual;

    function changeTraderToOperator(address _account, address _whitelist) external virtual;

    function changeSuperAdminToAdmin(address _account, address _whitelist) external virtual;

    function changeSuperAdminToOperator(address _account, address _whitelist) external virtual;
}
