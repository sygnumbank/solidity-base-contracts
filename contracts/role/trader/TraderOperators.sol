/**
 * @title RaiseOperators
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For managing account privileges associated to the traders executing trades on behalf of users: traders.
 */

pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "../base/Operatorable.sol";
import "./TraderOperatorable.sol";

contract TraderOperators is Operatorable {
    using Roles for Roles.Role;

    Roles.Role private _traders;

    event TraderAdded(address indexed caller, address indexed account);
    event TraderRemoved(address indexed caller, address indexed account);

    /**
     * @dev Confirms RaiseOperator contract address once acive.
     * @param _address Address of RaiseOperators contract.
     */
    function confirmFor(address _address) public onlyAdmin {
        TraderOperatorable(_address).confirmTraderOperatorsContract();
    }

    /**
     * @return If '_account' has trader privileges.
     */
    function isTrader(address _account) public view returns (bool) {
        return _traders.has(_account);
    }

    /**
     * @dev Operator can give '_account' address trader privileges.
     * @param _account address that should be given trader privileges.
     */
    function addTrader(address _account) public onlyAdminOrRelay {
        _addTrader(_account);
    }

    /**
     * @dev Operator can revoke '_account' address trader privileges.
     * @param _account address that should be revoked trader privileges.
     */
    function removeTrader(address _account) public onlyAdminOrRelay {
        _removeTrader(_account);
    }

    /* --------------- INTERNAL --------------- */
    function _addTrader(address _account) internal {
        _traders.add(_account);
        emit TraderAdded(msg.sender, _account);
    }

    function _removeTrader(address _account) internal {
        _traders.remove(_account);
        emit TraderRemoved(msg.sender, _account);
    }
}
