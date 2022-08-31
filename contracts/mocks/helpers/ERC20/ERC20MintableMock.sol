/**
 * @title ERC20MintableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating minting functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../helpers/ERC20/ERC20Mintable.sol";

contract ERC20MintableMock is ERC20Mintable {
    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param amount amount to mint.
     */
    function mint(address account, uint256 amount) public {
        ERC20Mintable._mint(account, amount);
    }
}
