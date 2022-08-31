// SPDX-License-Identifier: UNLICENSED

/**
 * @title ERC20Confiscatable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For confiscating funds from particular user addresses.
 */

pragma solidity ^0.8.0;

import "./ERC20Snapshot.sol";
import "../../role/base/Operatorable.sol";

contract ERC20Confiscatable is ERC20Snapshot, Operatorable {
    /**
     * @dev Confiscate(transfer) funds from a particular users address to another.
     * @param _confiscatee address confiscate funds from.
     * @param _receiver address receive funds.
     * @param _amount of funds to confiscate.
     */
    function _confiscate(
        address _confiscatee,
        address _receiver,
        uint256 _amount
    ) internal virtual override {
        super._confiscate(_confiscatee, _receiver, _amount);
    }
}
