/**
 * @title RaiseOperators
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For managing account privileges associated to the capital raise process: investors, and issuers.
 */

pragma solidity ^0.8.0;

import "../Roles.sol";
import "../base/Operatorable.sol";
import "./RaiseOperatorable.sol";

contract RaiseOperators is Operatorable {
    using Roles for Roles.Role;

    Roles.Role private _investors;
    Roles.Role private _issuers;

    event InvestorAdded(address indexed caller, address indexed account);
    event InvestorRemoved(address indexed caller, address indexed account);
    event IssuerAdded(address indexed caller, address indexed account);
    event IssuerRemoved(address indexed caller, address indexed account);

    /**
     * @dev Confirms RaiseOperator contract address once acive.
     * @param _address Address of RaiseOperators contract.
     */
    function confirmFor(address _address) public onlyAdmin {
        RaiseOperatorable(_address).confirmRaiseOperatorsContract();
    }

    /* --------------- INVESTOR --------------- */
    /**
     * @return If '_account' has investor privileges.
     */
    function isInvestor(address _account) public view returns (bool) {
        return _investors.has(_account);
    }

    /**
     * @dev Operator or relay can give '_account' address investor privileges if the contract is not paused.
     * @param _account address that should be given investor privileges.
     */
    function addInvestor(address _account) public onlyOperatorOrRelay {
        _addInvestor(_account);
    }

    /**
     * @dev Operator or relay can revoke '_account' address investor privileges if the contract is not paused.
     * @param _account address that should be revoked investor privileges.
     */
    function removeInvestor(address _account) public onlyOperatorOrRelay {
        _removeInvestor(_account);
    }

    /* --------------- ISSUER --------------- */
    /**
     * @return If '_account' has issuer privileges.
     */
    function isIssuer(address _account) public view returns (bool) {
        return _issuers.has(_account);
    }

    /**
     * @dev Operator/Admin can give '_account' address issuer privileges if the contract is not paused.
     * @param _account address that should be given issuer privileges.
     */
    function addIssuer(address _account) public onlyOperator {
        _addIssuer(_account);
    }

    /**
     * @dev Operator/Admin can revoke '_account' address issuer privileges if the contract is not paused.
     * @param _account address that should be revoked issuer privileges.
     */
    function removeIssuer(address _account) public onlyOperator {
        _removeIssuer(_account);
    }

    /* --------------- INTERNAL --------------- */
    function _addInvestor(address _account) internal {
        _investors.add(_account);
        emit InvestorAdded(msg.sender, _account);
    }

    function _removeInvestor(address _account) internal {
        _investors.remove(_account);
        emit InvestorRemoved(msg.sender, _account);
    }

    function _addIssuer(address _account) internal {
        _issuers.add(_account);
        emit IssuerAdded(msg.sender, _account);
    }

    function _removeIssuer(address _account) internal {
        _issuers.remove(_account);
        emit IssuerRemoved(msg.sender, _account);
    }
}
