/**
 * @title TraderOperatorableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking blocker operatorable contract.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../role/trader/TraderOperatorable.sol";

contract TraderOperatorableMock is TraderOperatorable {
    bool public TraderAction;
    bool public OperatorOrTraderOrSystemAction;

    /**
     * @dev Initialization instead of constructor to point to Base Operators and Raise Operators contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _traderOperators TraderOperators contract address.
     */
    function setContract(address _baseOperators, address _traderOperators) external {
        super.initialize(_baseOperators, _traderOperators);
    }

    /**
     * @dev Simulate trader action.
     */
    function traderAction() external onlyTrader {
        TraderAction = true;
    }

    /**
     * @dev Simulate operator or trader or system action.
     */
    function operatorOrTraderOrSystemAction() external onlyOperatorOrTraderOrSystem {
        OperatorOrTraderOrSystemAction = true;
    }
}
