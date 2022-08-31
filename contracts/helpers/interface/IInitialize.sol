// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @title IInitialize
 * @notice Interface for all contracts that have initialize functionality.
 */
abstract contract IInitialize {
    function initialize(address _contract) external virtual;
}
