/**
 * @title WhitelistMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating whitelist functionality, and inherited function modifiers.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../helpers/Whitelist.sol";

contract WhitelistMock is Whitelist {
    bool public WhitelistedAction;

    /**
     * @dev Simulated whitelisted action.
     */
    function whitelistedAction() external whenWhitelisted(msg.sender) {
        WhitelistedAction = true;
    }
}
