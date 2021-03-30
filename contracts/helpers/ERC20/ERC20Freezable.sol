/**
 * @title ERC20Freezable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Overloading ERC20 functions to ensure client addresses are not frozen for particular actions.
 */

pragma solidity 0.5.12;

import "./ERC20Overload/ERC20.sol";
import "../Freezable.sol";

contract ERC20Freezable is ERC20, Freezable {
    /**
     * @dev Overload transfer function to ensure sender and receiver have not been frozen.
     * @param to address that recieves the funds.
     * @param value amount of funds.
     */
    function transfer(address to, uint256 value) public whenNotFrozen(msg.sender) whenNotFrozen(to) returns (bool) {
        return super.transfer(to, value);
    }

    /**
     * @dev Overload approve function to ensure sender and receiver have not been frozen.
     * @param spender address that can spend the funds.
     * @param value amount of funds.
     */
    function approve(address spender, uint256 value)
        public
        whenNotFrozen(msg.sender)
        whenNotFrozen(spender)
        returns (bool)
    {
        return super.approve(spender, value);
    }

    /**
     * @dev Overload transferFrom function to ensure sender, approver and receiver have not been frozen.
     * @param from address that funds will be transferred from.
     * @param to address that funds will be transferred to.
     * @param value amount of funds.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public whenNotFrozen(msg.sender) whenNotFrozen(from) whenNotFrozen(to) returns (bool) {
        return super.transferFrom(from, to, value);
    }

    /**
     * @dev Overload increaseAllowance function to ensure sender and spender have not been frozen.
     * @param spender address that will be allowed to transfer funds.
     * @param addedValue amount of funds to added to current allowance.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        whenNotFrozen(msg.sender)
        whenNotFrozen(spender)
        returns (bool)
    {
        return super.increaseAllowance(spender, addedValue);
    }

    /**
     * @dev Overload decreaseAllowance function to ensure sender and spender have not been frozen.
     * @param spender address that will be allowed to transfer funds.
     * @param subtractedValue amount of funds to be deducted to current allowance.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        whenNotFrozen(msg.sender)
        whenNotFrozen(spender)
        returns (bool)
    {
        return super.decreaseAllowance(spender, subtractedValue);
    }

    /**
     * @dev Overload _burnfrom function to ensure sender and user to be burned from have not been frozen.
     * @param account account that funds will be burned from.
     * @param amount amount of funds to be burned.
     */
    function _burnFrom(address account, uint256 amount) internal whenNotFrozen(msg.sender) whenNotFrozen(account) {
        super._burnFrom(account, amount);
    }
}
