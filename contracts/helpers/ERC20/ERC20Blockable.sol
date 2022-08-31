// SPDX-License-Identifier: UNLICENSED

/**
 * @title ERC20Blockable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For blocking and unblocking particular user funds.
 */

pragma solidity ^0.8.0;

import "./ERC20Overload/ERC20.sol";
import "../../role/blocker/BlockerOperatorable.sol";

contract ERC20Blockable is ERC20, BlockerOperatorable {
    using SafeMath for uint256;
    uint256 public totalBlockedBalance;

    mapping(address => uint256) public _blockedBalances;

    event Blocked(address indexed blocker, address indexed account, uint256 value);
    event UnBlocked(address indexed blocker, address indexed account, uint256 value);

    /**
     * @dev Block funds, and move funds from _balances into _blockedBalances.
     * @param _account address to block funds.
     * @param _amount of funds to block.
     */
    function block(address _account, uint256 _amount) public onlyBlockerOrOperator {
        _balances[_account] = _balances[_account].sub(_amount);
        _blockedBalances[_account] = _blockedBalances[_account].add(_amount);

        totalBlockedBalance = totalBlockedBalance.add(_amount);
        emit Blocked(msg.sender, _account, _amount);
    }

    /**
     * @dev Unblock funds, and move funds from _blockedBalances into _balances.
     * @param _account address to unblock funds.
     * @param _amount of funds to unblock.
     */
    function unblock(address _account, uint256 _amount) public onlyBlockerOrOperator {
        _balances[_account] = _balances[_account].add(_amount);
        _blockedBalances[_account] = _blockedBalances[_account].sub(_amount);

        totalBlockedBalance = totalBlockedBalance.sub(_amount);
        emit UnBlocked(msg.sender, _account, _amount);
    }

    /**
     * @dev Getter for the amount of blocked balance for a particular address.
     * @param _account address to get blocked balance.
     * @return amount of blocked balance.
     */
    function blockedBalanceOf(address _account) public view returns (uint256) {
        return _blockedBalances[_account];
    }

    /**
     * @dev Getter for the total amount of blocked funds for all users.
     * @return amount of total blocked balance.
     */
    function getTotalBlockedBalance() public view returns (uint256) {
        return totalBlockedBalance;
    }
}
