/**
 * @title InitializableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating initializable functionality.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../helpers/Initializable.sol";

contract InitializableMock is Initializable {
    bool public initializerRan;
    bool public initializationAction;

    /**
     * @dev Simulated initialization action.
     */
    function initialize() public virtual initializer {
        initializerRan = true;
    }

    /**
     * @dev Simulated nested initialization.
     */
    function initializeNested() public virtual initializer {
        initialize();
    }
}
