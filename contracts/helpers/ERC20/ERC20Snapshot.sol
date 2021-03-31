/**
 * @title ERC20Snapshot
 * @author Team 3301 <team3301@sygnum.com>
 * @notice Records historical balances.
 */
pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC20Overload/ERC20.sol";

contract ERC20Snapshot is ERC20 {
    using SafeMath for uint256;

    /**
     * @dev `Snapshot` is the structure that attaches a block number to a
     * given value. The block number attached is the one that last changed the value
     */
    struct Snapshot {
        uint256 fromBlock; // `fromBlock` is the block number at which the value was generated from
        uint256 value; // `value` is the amount of tokens at a specific block number
    }

    /**
     * @dev `_snapshotBalances` is the map that tracks the balance of each address, in this
     * contract when the balance changes the block number that the change
     * occurred is also included in the map
     */
    mapping(address => Snapshot[]) private _snapshotBalances;

    // Tracks the history of the `totalSupply` of the token
    Snapshot[] private _snapshotTotalSupply;

    /**
     * @dev Queries the balance of `_owner` at a specific `_blockNumber`
     * @param _owner The address from which the balance will be retrieved
     * @param _blockNumber The block number when the balance is queried
     * @return The balance at `_blockNumber`
     */
    function balanceOfAt(address _owner, uint256 _blockNumber) public view returns (uint256) {
        return getValueAt(_snapshotBalances[_owner], _blockNumber);
    }

    /**
     * @dev Total amount of tokens at a specific `_blockNumber`.
     * @param _blockNumber The block number when the totalSupply is queried
     * @return The total amount of tokens at `_blockNumber`
     */
    function totalSupplyAt(uint256 _blockNumber) public view returns (uint256) {
        return getValueAt(_snapshotTotalSupply, _blockNumber);
    }

    /**
     * @dev `getValueAt` retrieves the number of tokens at a given block number
     * @param checkpoints The history of values being queried
     * @param _block The block number to retrieve the value at
     * @return The number of tokens being queried
     */
    function getValueAt(Snapshot[] storage checkpoints, uint256 _block) internal view returns (uint256) {
        if (checkpoints.length == 0) return 0;

        // Shortcut for the actual value
        if (_block >= checkpoints[checkpoints.length.sub(1)].fromBlock) {
            return checkpoints[checkpoints.length.sub(1)].value;
        }

        if (_block < checkpoints[0].fromBlock) {
            return 0;
        }

        // Binary search of the value in the array
        uint256 min;
        uint256 max = checkpoints.length.sub(1);

        while (max > min) {
            uint256 mid = (max.add(min).add(1)).div(2);
            if (checkpoints[mid].fromBlock <= _block) {
                min = mid;
            } else {
                max = mid.sub(1);
            }
        }

        return checkpoints[min].value;
    }

    /**
     * @dev `updateValueAtNow` used to update the `_snapshotBalances` map and the `_snapshotTotalSupply`
     * @param checkpoints The history of data being updated
     * @param _value The new number of tokens
     */
    function updateValueAtNow(Snapshot[] storage checkpoints, uint256 _value) internal {
        if ((checkpoints.length == 0) || (checkpoints[checkpoints.length.sub(1)].fromBlock < block.number)) {
            checkpoints.push(Snapshot(block.number, _value));
        } else {
            checkpoints[checkpoints.length.sub(1)].value = _value;
        }
    }

    /**
     * @dev Internal function that transfers an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param to The account that will receive the created tokens.
     * @param value The amount that will be created.
     */
    function transfer(address to, uint256 value) public returns (bool result) {
        result = super.transfer(to, value);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[msg.sender], balanceOf(msg.sender));
        updateValueAtNow(_snapshotBalances[to], balanceOf(to));
    }

    /**
     * @dev Internal function that transfers an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param from The account that funds will be taken from.
     * @param to The account that funds will be given too.
     * @param value The amount of funds to be transferred..
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool result) {
        result = super.transferFrom(from, to, value);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[from], balanceOf(from));
        updateValueAtNow(_snapshotBalances[to], balanceOf(to));
    }

    /**
     * @dev Internal function that confiscates an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param confiscatee The account that funds will be taken from.
     * @param receiver The account that funds will be given too.
     * @param amount The amount of funds to be transferred..
     */
    function _confiscate(
        address confiscatee,
        address receiver,
        uint256 amount
    ) internal {
        super._transfer(confiscatee, receiver, amount);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[confiscatee], balanceOf(confiscatee));
        updateValueAtNow(_snapshotBalances[receiver], balanceOf(receiver));
    }

    /**
     * @dev Internal function that mints an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param account The account that will receive the created tokens.
     * @param amount The amount that will be created.
     */
    function _mint(address account, uint256 amount) internal {
        super._mint(account, amount);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[account], balanceOf(account));
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param amount The amount that will be burnt.
     */
    function _burn(address account, uint256 amount) internal {
        super._burn(account, amount);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[account], balanceOf(account));
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param amount The amount that will be burnt.
     */
    function _burnFor(address account, uint256 amount) internal {
        super._burn(account, amount);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[account], balanceOf(account));
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account, deducting from the sender's allowance for said account. Uses the
     * internal burn function.
     * @param account The account whose tokens will be burnt.
     * @param amount The amount that will be burnt.
     */
    function _burnFrom(address account, uint256 amount) internal {
        super._burnFrom(account, amount);
        updateValueAtNow(_snapshotTotalSupply, totalSupply());
        updateValueAtNow(_snapshotBalances[account], balanceOf(account));
    }
}
