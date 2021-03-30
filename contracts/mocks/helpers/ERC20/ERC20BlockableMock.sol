/**
 * @title ERC20BlockableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating block/unblock functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/ERC20/ERC20Blockable.sol";

contract ERC20BlockableMock is ERC20Blockable {
    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }
}
