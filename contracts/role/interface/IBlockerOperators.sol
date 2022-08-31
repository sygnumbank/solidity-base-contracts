/**
 * @title IBlockerOperators
 * @notice Interface for BlockerOperators contract
 */

pragma solidity ^0.8.0;

abstract contract IBlockerOperators {
    function isBlocker(address _account) external view virtual returns (bool);

    function addBlocker(address _account) external virtual;

    function removeBlocker(address _account) external virtual;
}
