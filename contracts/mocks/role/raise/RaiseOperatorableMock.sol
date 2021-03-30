/**
 * @title RaiseOperatorableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking blocker operatorable contract.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../role/raise/RaiseOperatorable.sol";

contract RaiseOperatorableMock is RaiseOperatorable {
    bool public InvestorAction;
    bool public IssuerAction;

    /**
     * @dev Initialization instead of constructor to point to Base Operators and Raise Operators contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _raiseOperators RaiseOperators contract address.
     */
    function setContract(address _baseOperators, address _raiseOperators) external {
        super.initialize(_baseOperators, _raiseOperators);
    }

    /**
     * @dev Simulate investor action.
     */
    function investorAction() external onlyInvestor {
        InvestorAction = true;
    }

    /**
     * @dev Simulate issuer action.
     */
    function issuerAction() external onlyIssuer {
        IssuerAction = true;
    }
}
