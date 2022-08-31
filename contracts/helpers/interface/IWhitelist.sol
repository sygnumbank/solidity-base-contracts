// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @title IWhitelist
 * @notice Interface for Whitelist contract
 */
abstract contract IWhitelist {
    function isWhitelisted(address _account) external view virtual returns (bool);

    function toggleWhitelist(address _account, bool _toggled) external virtual;
}
