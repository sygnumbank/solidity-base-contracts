/**
 * @title PausableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating pausable functionality, and inherited function modifiers.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../helpers/Pausable.sol";

contract PausableMock is Pausable {
    bool public UnpausedAction;
    bool public PausedAction;

    /**
     * @dev Simulated not paused action.
     */
    function unpausedAction() external whenNotPaused {
        UnpausedAction = true;
    }

    /**
     * @dev Simulated paused action.
     */
    function pausedAction() external whenPaused {
        PausedAction = true;
    }
}
