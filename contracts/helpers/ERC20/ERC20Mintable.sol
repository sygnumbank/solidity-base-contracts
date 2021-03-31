/**
 * @title ERC20Mintable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For blocking and unblocking particular user funds.
 */

pragma solidity 0.5.12;

import "./ERC20Overload/ERC20.sol";
import "../../role/base/Operatorable.sol";

contract ERC20Mintable is ERC20, Operatorable {
    /**
     * @dev Overload _mint to ensure only operator or system can mint funds.
     * @param account address that will recieve new funds.
     * @param amount of funds to be minted.
     */
    function _mint(address account, uint256 amount) internal onlyOperatorOrSystem {
        require(amount > 0, "ERC20Mintable: amount has to be greater than 0");
        super._mint(account, amount);
    }
}
