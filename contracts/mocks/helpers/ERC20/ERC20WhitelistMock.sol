/**
 * @title ERC20WhitelistMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating whitelist functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/ERC20/ERC20Whitelist.sol";

contract ERC20WhitelistMock is ERC20Whitelist {
    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }

    /**
     * @dev Access internal burn function.
     * @param value amount to burn.
     */
    function burn(uint256 value) public {
        super._burn(msg.sender, value);
    }

    /**
     * @dev Access internal burnFrom function.
     * @param account Account to burn funds from.
     * @param value amount to burn.
     */
    function burnFrom(address account, uint256 value) public {
        super._burnFrom(account, value);
    }
}
