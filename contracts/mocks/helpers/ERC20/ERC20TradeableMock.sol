/**
 * @title ERC20TradeableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating tradeable functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/ERC20/ERC20Tradeable.sol";

contract ERC20TradeableMock is ERC20Tradeable {
    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }
}
