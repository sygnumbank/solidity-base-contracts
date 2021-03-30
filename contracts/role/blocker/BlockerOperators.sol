/**
 * @title BlockOperators
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For managing account privileges associated to blocking of DCHF and equity tokens: blockers.
 */

pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "../base/Operatorable.sol";
import "./BlockerOperatorable.sol";

contract BlockerOperators is Operatorable {
    using Roles for Roles.Role;

    Roles.Role private _blockers;

    event BlockerAdded(address indexed caller, address indexed account);
    event BlockerRemoved(address indexed caller, address indexed account);

    /**
     * @dev Confirms BlockerOperator contract address once acive.
     * @param _address Address of BlockerOperator contract.
     */
    function confirmFor(address _address) public onlyAdmin {
        BlockerOperatorable(_address).confirmBlockerOperatorsContract();
    }

    /* --------------- BLOCKER --------------- */
    /**
     * @return If '_account' has blocker privileges.
     */
    function isBlocker(address _account) public view returns (bool) {
        return _blockers.has(_account);
    }

    /**
     * @dev Operator or relay can give '_account' address blocker privileges.
     * @param _account address that should be given blocker privileges.
     */
    function addBlocker(address _account) public onlyOperatorOrRelay {
        _addBlocker(_account);
    }

    /**
     * @dev Operator or relay can revoke '_account' address blocker privileges.
     * @param _account address that should be revoked blocker privileges.
     */
    function removeBlocker(address _account) public onlyOperatorOrRelay {
        _removeBlocker(_account);
    }

    /* --------------- INTERNAL --------------- */
    function _addBlocker(address _account) internal {
        _blockers.add(_account);
        emit BlockerAdded(msg.sender, _account);
    }

    function _removeBlocker(address _account) internal {
        _blockers.remove(_account);
        emit BlockerRemoved(msg.sender, _account);
    }
}
