/**
 * @title ERC20Whitelist
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Overloading ERC20 functions to ensure that addresses attempting to particular
 * actions are whitelisted.
 */

pragma solidity 0.5.12;

import "./ERC20Overload/ERC20.sol";
import "../instance/Whitelistable.sol";

contract ERC20Whitelist is ERC20, Whitelistable {
    /**
     * @dev Overload transfer function to validate sender and receiver are whitelisted.
     * @param to address that recieves the funds.
     * @param value amount of funds.
     */
    function transfer(address to, uint256 value) public whenWhitelisted(msg.sender) whenWhitelisted(to) returns (bool) {
        return super.transfer(to, value);
    }

    /**
     * @dev Overload approve function to validate sender and spender are whitelisted.
     * @param spender address that can spend the funds.
     * @param value amount of funds.
     */
    function approve(address spender, uint256 value)
        public
        whenWhitelisted(msg.sender)
        whenWhitelisted(spender)
        returns (bool)
    {
        return super.approve(spender, value);
    }

    /**
     * @dev Overload transferFrom function to validate sender, from and receiver are whitelisted.
     * @param from address that funds will be transferred from.
     * @param to address that funds will be transferred to.
     * @param value amount of funds.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public whenWhitelisted(msg.sender) whenWhitelisted(from) whenWhitelisted(to) returns (bool) {
        return super.transferFrom(from, to, value);
    }

    /**
     * @dev Overload increaseAllowance validate sender and spender are whitelisted.
     * @param spender address that will be allowed to transfer funds.
     * @param addedValue amount of funds to added to current allowance.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        whenWhitelisted(spender)
        whenWhitelisted(msg.sender)
        returns (bool)
    {
        return super.increaseAllowance(spender, addedValue);
    }

    /**
     * @dev Overload decreaseAllowance validate sender and spender are whitelisted.
     * @param spender address that will be allowed to transfer funds.
     * @param subtractedValue amount of funds to be deducted to current allowance.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        whenWhitelisted(spender)
        whenWhitelisted(msg.sender)
        returns (bool)
    {
        return super.decreaseAllowance(spender, subtractedValue);
    }

    /**
     * @dev Overload _burn function to ensure that account has been whitelisted.
     * @param account address that funds will be burned from.
     * @param value amount of funds that will be burned.
     */
    function _burn(address account, uint256 value) internal whenWhitelisted(account) {
        super._burn(account, value);
    }

    /**
     * @dev Overload _burnFrom function to ensure sender and account have been whitelisted.
     * @param account address that funds will be burned from allowance.
     * @param amount amount of funds that will be burned.
     */
    function _burnFrom(address account, uint256 amount) internal whenWhitelisted(msg.sender) whenWhitelisted(account) {
        super._burnFrom(account, amount);
    }

    /**
     * @dev Overload _mint function to ensure account has been whitelisted.
     * @param account address that funds will be minted to.
     * @param amount amount of funds that will be minted.
     */
    function _mint(address account, uint256 amount) internal whenWhitelisted(account) {
        super._mint(account, amount);
    }
}
