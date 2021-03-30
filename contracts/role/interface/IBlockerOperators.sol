/**
 * @title IBlockerOperators
 * @notice Interface for BlockerOperators contract
 */

pragma solidity 0.5.12;

contract IBlockerOperators {
    function isBlocker(address _account) external view returns (bool);

    function addBlocker(address _account) external;

    function removeBlocker(address _account) external;
}
