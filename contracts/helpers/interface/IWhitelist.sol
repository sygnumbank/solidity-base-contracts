pragma solidity 0.5.12;

/**
 * @title IWhitelist
 * @notice Interface for Whitelist contract
 */
contract IWhitelist {
    function isWhitelisted(address _account) external view returns (bool);

    function toggleWhitelist(address _account, bool _toggled) external;
}
