// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @title IWhitelistable
 * @notice Interface for whitelistable contract.
 */
abstract contract IWhitelistable {
    function confirmWhitelistContract() external virtual;
}
