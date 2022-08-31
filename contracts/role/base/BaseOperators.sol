/**
 * @title BaseOperators
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For managing operators, admins, and system accounts.
 */

pragma solidity ^0.8.0;

import "../Roles.sol";
import "./Operatorable.sol";

contract BaseOperators {
    using Roles for Roles.Role;

    address private _multisig;
    Roles.Role private _operators;
    Roles.Role private _admins;
    Roles.Role private _systems;
    Roles.Role private _relays;

    /**
     * @dev Error: "BaseOperators: caller does not have the admin role"
     */
    error BaseOperatorsCallerNotAdmin();

    /**
     * @dev Error: "BaseOperators: caller does not have multisig role"
     */
    error BaseOperatorsCallerNotMultisig();

    /**
     * @dev Error: "BaseOperators: caller does not have the admin role nor relay"
     */
    error BaseOperatorsCallerNotAdminOrRelay();

    /**
     * @dev Error: "BaseOperators: address cannot be empty."
     */
    error BaseOperatorsZeroAddress();

    /**
     * @dev Error: "BaseOperators: admin can not remove himself"
     */
    error BaseOperatorsAdminRemoveSelf();

    /**
     * @dev Error: "BaseOperators: cannot assign new multisig when multisig already assigned"
     */
    error BaseOperatorsMultisigAlreadyAssigned();

    /**
     * @dev Error: "BaseOperators: multisig has to be contract"
     */
    error BaseOperatorsMultisigNotContract();

    event OperatorAdded(address indexed caller, address indexed account);
    event OperatorRemoved(address indexed caller, address indexed account);
    event AdminAdded(address indexed caller, address indexed account);
    event AdminRemoved(address indexed caller, address indexed account);
    event SystemAdded(address indexed caller, address indexed account);
    event SystemRemoved(address indexed caller, address indexed account);
    event RelayAdded(address indexed caller, address indexed relay);
    event RelayRemoved(address indexed caller, address indexed relay);
    event MultisigChanged(address indexed caller, address indexed multisig);

    /**
     * @dev Reverts if caller does not have admin role associated.
     */
    modifier onlyAdmin() {
        if (!isAdmin(msg.sender)) revert BaseOperatorsCallerNotAdmin();
        _;
    }

    /**
     * @dev Reverts if caller does not have multisig privileges;
     */
    modifier onlyMultisig() {
        if (!isMultisig(msg.sender)) revert BaseOperatorsCallerNotMultisig();
        _;
    }

    /**
     * @dev Reverts if caller does not have admin or relay role associated.
     */
    modifier onlyAdminOrRelay() {
        if (!isAdmin(msg.sender) && !isRelay(msg.sender)) revert BaseOperatorsCallerNotAdminOrRelay();
        _;
    }

    constructor(address _admin) {
        _addAdmin(_admin);
    }

    /**
     * @dev Confirms operator contract address once active.
     * @param _address Operatorable contract addres.
     */
    function confirmFor(address _address) public onlyAdmin {
        if (_address == address(0)) revert BaseOperatorsZeroAddress();
        Operatorable(_address).confirmOperatorsContract();
    }

    /**
     * @return If '_account' has operator privileges.
     */
    function isOperator(address _account) public view returns (bool) {
        return _operators.has(_account);
    }

    /**
     * @dev Admin can give '_account' address operator privileges.
     * @param _account address that should be given operator privileges.
     */
    function addOperator(address _account) public onlyAdminOrRelay {
        _addOperator(_account);
    }

    /**
     * @dev Admin can revoke '_account' address operator privileges.
     * @param _account address that should be revoked operator privileges.
     */
    function removeOperator(address _account) public onlyAdminOrRelay {
        _removeOperator(_account);
    }

    /**
     * @return If '_account' has operator privileges.
     */
    function isAdmin(address _account) public view returns (bool) {
        return _admins.has(_account);
    }

    /**
     * @dev Admin can give '_account' address admin privileges.
     * @param _account address that should be given admin privileges.
     */
    function addAdmin(address _account) public onlyAdminOrRelay {
        _addAdmin(_account);
    }

    /**
     * @dev Admin can revoke '_account' address admin privileges.
     * @param _account address that should be revoked admin privileges.
     */
    function removeAdmin(address _account) public onlyAdminOrRelay {
        if (_account == msg.sender) revert BaseOperatorsAdminRemoveSelf();
        _removeAdmin(_account);
    }

    /**
     * @return If '_account' has admin or operator privileges.
     */
    function isOperatorOrAdmin(address _account) public view returns (bool) {
        return (isAdmin(_account) || isOperator(_account));
    }

    /**
     * @return If '_account' has admin and operator privileges, also known as a Super Admin.
     */
    function isOperatorAndAdmin(address _account) public view returns (bool) {
        return (isAdmin(_account) && isOperator(_account));
    }

    /**
     * @return If '_account' has system privileges.
     */
    function isSystem(address _account) public view returns (bool) {
        return _systems.has(_account);
    }

    /**
     * @dev Admin account or relay contract can give '_account' address system privileges.
     * @param _account address that should be given system privileges.
     */
    function addSystem(address _account) public onlyAdminOrRelay {
        _addSystem(_account);
    }

    /**
     * @dev Admin account or relay contract can revoke '_account' address system privileges.
     * @param _account address that should be revoked system privileges.
     */
    function removeSystem(address _account) public onlyAdminOrRelay {
        _removeSystem(_account);
    }

    /**
     * @return If '_account' has relay privileges.
     */
    function isRelay(address _account) public view returns (bool) {
        return _relays.has(_account);
    }

    /**
     * @dev Operator can give '_account' address relay privileges.
     * @param _account address that should be given relay privileges.
     */
    function addRelay(address _account) public onlyAdmin {
        _addRelay(_account);
    }

    /**
     * @dev Operator can revoke '_account' address relay privileges.
     * @param _account address that should be revoked relay privileges.
     */
    function removeRelay(address _account) public onlyAdmin {
        _removeRelay(_account);
    }

    /**
     * @return If '_contract' has multisig privileges.
     */
    function isMultisig(address _contract) public view returns (bool) {
        return _multisig == _contract;
    }

    /**
     * @dev Admin can give '_contract' address multisig privileges.
     * @param _contract address that should be given multisig privileges.
     */
    function addMultisig(address _contract) public onlyAdmin {
        if (_multisig != address(0)) revert BaseOperatorsMultisigAlreadyAssigned();
        _changeMultisig(_contract);
    }

    /**
     * @dev Multisig can change multisig privileges to new multisig '_contract'.
     * @param _contract address that should be the new multisig.
     */
    function changeMultisig(address _contract) public onlyMultisig {
        _changeMultisig(_contract);
    }

    /**
     * @dev Admin can give '_account' address operator and admin privileges making the '_account' a super admin, whereby they can call operator and admin functions.
     * @param _account address that should be given operator and admin privileges.
     */
    function addOperatorAndAdmin(address _account) public onlyAdminOrRelay {
        _addAdmin(_account);
        _addOperator(_account);
    }

    /**
     * @dev Admin can revoke '_account' address operator and admin privileges.
     * @param _account address that should be revoked operator and admin privileges.
     */
    function removeOperatorAndAdmin(address _account) public onlyAdminOrRelay {
        if (_account == msg.sender) revert BaseOperatorsAdminRemoveSelf();
        _removeAdmin(_account);
        _removeOperator(_account);
    }

    /**
     * @dev Admin can change '_account' admin privileges to an operator privileges.
     * @param _account address that should be given operator and admin privileges.
     */
    function changeToOperator(address _account) public onlyAdmin {
        if (_account == msg.sender) revert BaseOperatorsAdminRemoveSelf();
        _removeAdmin(_account);
        _addOperator(_account);
    }

    /**
     * @dev Admin can change '_account' operator privileges to admin privileges.
     * @param _account address that should be given operator and admin privileges.
     */
    function changeToAdmin(address _account) public onlyAdmin {
        _addAdmin(_account);
        _removeOperator(_account);
    }

    /** INTERNAL FUNCTIONS */
    function _addOperator(address _account) internal {
        _operators.add(_account);
        emit OperatorAdded(msg.sender, _account);
    }

    function _removeOperator(address _account) internal {
        _operators.remove(_account);
        emit OperatorRemoved(msg.sender, _account);
    }

    function _addAdmin(address _account) internal {
        _admins.add(_account);
        emit AdminAdded(msg.sender, _account);
    }

    function _removeAdmin(address _account) internal {
        _admins.remove(_account);
        emit AdminRemoved(msg.sender, _account);
    }

    function _addSystem(address _account) internal {
        _systems.add(_account);
        emit SystemAdded(msg.sender, _account);
    }

    function _removeSystem(address _account) internal {
        _systems.remove(_account);
        emit SystemRemoved(msg.sender, _account);
    }

    function _addRelay(address _account) internal {
        _relays.add(_account);
        emit RelayAdded(msg.sender, _account);
    }

    function _removeRelay(address _account) internal {
        _relays.remove(_account);
        emit RelayRemoved(msg.sender, _account);
    }

    function _changeMultisig(address _contract) internal {
        if (_contract == address(0)) revert BaseOperatorsZeroAddress();
        if (isMultisig(msg.sender)) {
            uint32 size;
            // solhint-disable-next-line
            assembly {
                size := extcodesize(_contract)
            }
            if (size == 0) revert BaseOperatorsMultisigNotContract();
        }
        _multisig = _contract;
        emit MultisigChanged(msg.sender, _contract);
    }
}
