/**
 * @title ERC20BurnableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating burnable functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../helpers/ERC20/ERC20Burnable.sol";

contract ERC20BurnableMock is ERC20Burnable {
    /**
     * @dev Access internal burnFor function.
     * @param account Account to mint funds to.
     * @param amount amount to burn.
     */
    function burnFor(address account, uint256 amount) public {
        super._burnFor(account, amount);
    }

    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }
}
