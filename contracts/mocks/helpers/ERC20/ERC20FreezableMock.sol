/**
 * @title ERC20BurnableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating freezable functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/ERC20/ERC20Freezable.sol";

contract ERC20FreezableMock is ERC20Freezable {
    /**
     * @dev Access internal burnFrom function.
     * @param account Account to burn funds from.
     * @param amount amount to burn.
     */
    function burnFrom(address account, uint256 amount) public {
        super._burnFrom(account, amount);
    }

    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param amount amount to mint.
     */
    function mint(address account, uint256 amount) public {
        super._mint(account, amount);
    }
}
