// SPDX-License-Identifier: UNLICENSED

/**
 * @title ERC20Destroyable
 * @author Team 3301 <team3301@sygnum.com>
 * @notice Allows operator to destroy contract.
 */

pragma solidity ^0.8.0;

import "../../role/base/Operatorable.sol";

contract ERC20Destroyable is Operatorable {
    event Destroyed(address indexed caller, address indexed account, address indexed contractAddress);

    function destroy(address payable to) public onlyOperator {
        emit Destroyed(msg.sender, to, address(this));
        selfdestruct(to);
    }
}
