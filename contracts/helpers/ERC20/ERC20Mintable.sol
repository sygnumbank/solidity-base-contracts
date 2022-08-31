// SPDX-License-Identifier: UNLICENSED

/**
 * @title ERC20Mintable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev For blocking and unblocking particular user funds.
 */

pragma solidity ^0.8.0;

import "./ERC20Overload/ERC20.sol";
import "../../role/base/Operatorable.sol";

contract ERC20Mintable is ERC20, Operatorable {
    /**
     * @dev Error: "ERC20Mintable: amount has to be greater than 0"
     */
    error ERC20MintableZeroMintAmount();

    /**
     * @dev Overload _mint to ensure only operator or system can mint funds.
     * @param account address that will recieve new funds.
     * @param amount of funds to be minted.
     */
    function _mint(address account, uint256 amount) internal virtual override onlyOperatorOrSystem {
        if (amount <= 0) revert ERC20MintableZeroMintAmount();

        super._mint(account, amount);
    }
}
