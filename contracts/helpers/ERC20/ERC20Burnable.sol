/**
 * @title ERC20Burnable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For burning funds from particular user addresses.
 */

pragma solidity 0.5.12;

import "./ERC20Snapshot.sol";
import "../../role/base/Operatorable.sol";

contract ERC20Burnable is ERC20Snapshot, Operatorable {
    /**
     * @dev Overload ERC20 _burnFor, burning funds from a particular users address.
     * @param account address to burn funds from.
     * @param amount of funds to burn.
     */

    function _burnFor(address account, uint256 amount) internal onlyOperator {
        super._burn(account, amount);
    }
}
