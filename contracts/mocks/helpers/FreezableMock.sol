/**
 * @title FreezableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating freezing functionality, and inherited function modifiers.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../helpers/Freezable.sol";

contract FreezableMock is Freezable {
    bool public UnfrozenAction;
    bool public FrozenAction;

    /**
     * @dev Simulated not frozen action.
     */
    function unfrozenAction() external whenNotFrozen(msg.sender) {
        UnfrozenAction = true;
    }

    /**
     * @dev Simulated frozen action.
     */
    function frozenAction() external whenFrozen(msg.sender) {
        FrozenAction = true;
    }
}
