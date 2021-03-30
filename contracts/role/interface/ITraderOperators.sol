/**
 * @title ITraderOperators
 * @notice Interface for TraderOperators contract
 */

pragma solidity 0.5.12;

contract ITraderOperators {
    function isTrader(address _account) external view returns (bool);

    function addTrader(address _account) external;

    function removeTrader(address _account) external;
}
