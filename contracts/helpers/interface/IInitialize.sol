pragma solidity 0.5.12;

/**
 * @title IInitialize
 * @notice Interface for all contracts that have initialize functionality.
 */
contract IInitialize {
    function initialize(address _contract) external;
}
