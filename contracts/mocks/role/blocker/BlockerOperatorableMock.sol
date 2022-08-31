/**
 * @title BlockerOperatorableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking blocker operatorable contract.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../role/blocker/BlockerOperatorable.sol";

contract BlockerOperatorableMock is BlockerOperatorable {
    bool public BlockerAction;
    bool public BlockerOrOperatorAction;

    event BlockerCalled(address caller, bool blockerAction);
    event BlockerOrOperatorCalled(address caller, bool BlockerOrOperatorAction);

    /**
     * @dev Initialization instead of constructor to point to Base Operators and Blockers contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _blockerOperators BlockerOperators contract address.
     */
    function setContract(address _baseOperators, address _blockerOperators) external {
        super.initialize(_baseOperators, _blockerOperators);
    }

    /**
     * @dev Simulate blockers action.
     */
    function blockerAction() external onlyBlocker {
        BlockerAction = true;
        emit BlockerCalled(msg.sender, BlockerAction);
    }

    /**
     * @dev Simulate blockers or operators action.
     */
    function blockerOrOperatorAction() external onlyBlockerOrOperator {
        BlockerOrOperatorAction = true;
        emit BlockerOrOperatorCalled(msg.sender, BlockerOrOperatorAction);
    }
}
