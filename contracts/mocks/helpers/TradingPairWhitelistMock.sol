/**
 * @title TradingPairWhitelistMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating trading pair whitelist functionality, and inherited function modifiers.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../helpers/TradingPairWhitelist.sol";

contract TradingPairWhitelistMock is TradingPairWhitelist {
    bool public PairedAction;
    bool public WhenNotFrozenAction;

    /**
     * @dev Simulated paired action.
     * @param _buyToken to check if paired.
     * @param _sellToken to check if paired.
     */
    function pairedAction(address _buyToken, address _sellToken) external onlyPaired(_buyToken, _sellToken) {
        PairedAction = true;
    }

    /**
     * @dev Simulated not frozen pair action.
     * @param _buyToken to check if paired.
     * @param _sellToken to check if paired.
     */
    function whenNotFrozenAction(address _buyToken, address _sellToken) external whenNotFrozen(_buyToken, _sellToken) {
        WhenNotFrozenAction = true;
    }
}
