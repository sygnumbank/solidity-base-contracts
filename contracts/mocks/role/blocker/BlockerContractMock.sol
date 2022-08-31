/**
 * @title BlockerContractMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking blocker contract action - simulation of the DEX contract.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "./BlockerOperatorableMock.sol";

contract BlockerContractMock {
    /**
     * @dev Call blocker action in other contract.
     * @param _contract contract to call action.
     */
    function callBlocker(address _contract) public {
        BlockerOperatorableMock(_contract).blockerAction();
    }

    /**
     * @dev Call blocker or operator action in other contract.
     * @param _contract contract to call action.
     */
    function callBlockerOrOperator(address _contract) public {
        BlockerOperatorableMock(_contract).blockerOrOperatorAction();
    }
}
