/**
 * @title ERC20Tradeable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Trader accounts can approve particular addresses on behalf of a user.
 */

pragma solidity 0.5.12;

import "./ERC20Overload/ERC20.sol";
import "../../role/trader/TraderOperatorable.sol";

contract ERC20Tradeable is ERC20, TraderOperatorable {
    /**
     * @dev Trader can approve users balance to a particular address for a particular amount.
     * @param _owner address that approves the funds.
     * @param _spender address that spends the funds.
     * @param _value amount of funds.
     */
    function approveOnBehalf(
        address _owner,
        address _spender,
        uint256 _value
    ) public onlyTrader {
        super._approve(_owner, _spender, _value);
    }
}
