/**
 * @title IOnboardRouter
 * @notice Interface for OnboardRouter contract
 */

pragma solidity 0.5.12;

contract IOnboardRouter {
    function isWhitelisted(address _account, address _whitelist) external returns (bool);

    function onboardSystem(address _account, address _whitelist) external;

    function deboardSystem(address _account, address _whitelist) external;

    function onboardSuperAdmin(address _account, address _whitelist) external;

    function deboardSuperAdmin(address _account, address _whitelist) external;

    function onboardInvestor(address _account, address _whitelist) external;

    function deboardInvestor(address _account, address _whitelist) external;

    function onboardTrader(address _account, address _whitelist) external;

    function deboardTrader(address _account, address _whitelist) external;

    function onboardBlocker(address _account, address _whitelist) external;

    function deboardBlocker(address _account, address _whitelist) external;

    function changeAdminToTrader(address _account, address _whitelist) external;

    function changeAdminToSuperAdmin(address _account, address _whitelist) external;

    function changeOperatorToTrader(address _account, address _whitelist) external;

    function changeOperatorToSuperAdmin(address _account, address _whitelist) external;

    function changeTraderToAdmin(address _account, address _whitelist) external;

    function changeTraderToOperator(address _account, address _whitelist) external;

    function changeSuperAdminToAdmin(address _account, address _whitelist) external;

    function changeSuperAdminToOperator(address _account, address _whitelist) external;
}
