// SPDX-License-Identifier: UNLICENSED

/**
 * @title ERC20Pausable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Overloading ERC20 functions to ensure that the contract has not been paused.
 */

pragma solidity ^0.8.0;

import "./ERC20Overload/ERC20.sol";
import "../Pausable.sol";

contract ERC20Pausable is ERC20, Pausable {
    /**
     * @dev Overload transfer function to ensure contract has not been paused.
     * @param to address that recieves the funds.
     * @param value amount of funds.
     */
    function transfer(address to, uint256 value) public virtual override whenNotPaused returns (bool) {
        return super.transfer(to, value);
    }

    /**
     * @dev Overload approve function to ensure contract has not been paused.
     * @param spender address that can spend the funds.
     * @param value amount of funds.
     */
    function approve(address spender, uint256 value) public virtual override whenNotPaused returns (bool) {
        return super.approve(spender, value);
    }

    /**
     * @dev Overload transferFrom function to ensure contract has not been paused.
     * @param from address that funds will be transferred from.
     * @param to address that funds will be transferred to.
     * @param value amount of funds.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, value);
    }

    /**
     * @dev Overload increaseAllowance function to ensure contract has not been paused.
     * @param spender address that will be allowed to transfer funds.
     * @param addedValue amount of funds to added to current allowance.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return super.increaseAllowance(spender, addedValue);
    }

    /**
     * @dev Overload decreaseAllowance function to ensure contract has not been paused.
     * @param spender address that will be allowed to transfer funds.
     * @param subtractedValue amount of funds to be deducted to current allowance.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return super.decreaseAllowance(spender, subtractedValue);
    }

    /**
     * @dev Overload _burn function to ensure contract has not been paused.
     * @param account address that funds will be burned from.
     * @param value amount of funds that will be burned.
     */
    function _burn(address account, uint256 value) internal virtual override whenNotPaused {
        super._burn(account, value);
    }

    /**
     * @dev Overload _burnFrom function to ensure contract has not been paused.
     * @param account address that funds will be burned from allowance.
     * @param amount amount of funds that will be burned.
     */
    function _burnFrom(address account, uint256 amount) internal virtual override whenNotPaused {
        super._burnFrom(account, amount);
    }

    /**
     * @dev Overload _mint function to ensure contract has not been paused.
     * @param account address that funds will be minted to.
     * @param amount amount of funds that will be minted.
     */
    function _mint(address account, uint256 amount) internal virtual override whenNotPaused {
        super._mint(account, amount);
    }
}
