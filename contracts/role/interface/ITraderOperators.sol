/**
 * @title ITraderOperators
 * @notice Interface for TraderOperators contract
 */

pragma solidity ^0.8.0;

abstract contract ITraderOperators {
    function isTrader(address _account) external view virtual returns (bool);

    function addTrader(address _account) external virtual;

    function removeTrader(address _account) external virtual;
}
