/**
 * @title WhitelistableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating freezing functionality, and inherited function modifiers.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/instance/Whitelistable.sol";

contract WhitelistableMock is Whitelistable {
    bool public UnwhitelistedAction;
    bool public WhitelistedAction;

    /**
     * @dev Simulate unwhitelisted action.
     */
    function unwhitelistedAction() external {
        UnwhitelistedAction = true;
    }

    /**
     * @dev Simulated whitelisted action.
     */
    function whitelistedAction() external whenWhitelisted(msg.sender) {
        WhitelistedAction = true;
    }
}
