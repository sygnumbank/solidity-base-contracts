/**
 * @title ERC20ConfiscatableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating confiscate functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../helpers/ERC20/ERC20Confiscatable.sol";

contract ERC20ConfiscatableMock is ERC20Confiscatable {
    uint256 constant BATCH_LIMIT = 256;

    /**
     * @dev Error: "ERC20ConfiscatableMock: confiscatees, recipients and values are not equal."
     */
    error ERC20ConfiscatableMockLengthsNotEqual();

    /**
     * @dev Error: "ERC20ConfiscatableMock: batch count is greater than BATCH_LIMIT."
     */
    error ERC20ConfiscatableMockBatchCountTooLarge(uint256 _batchCount);

    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }

    /**
     * @dev Access internal confiscate function.
     * @param _confiscatee Account to transfer funds from.
     * @param _receiver Account to transfer funds to.
     * @param _amount to confiscate.
     */
    function confiscate(
        address _confiscatee,
        address _receiver,
        uint256 _amount
    ) public onlyOperator {
        super._confiscate(_confiscatee, _receiver, _amount);
    }

    /**
     * @dev Batch confiscate calling public confiscate function.
     * @param _confiscatees Array of accounts to transfer funds from.
     * @param _receivers Array of accounts to transfer funds to.
     * @param _values Array of amounts to transfer.
     */
    function batchConfiscate(
        address[] memory _confiscatees,
        address[] memory _receivers,
        uint256[] memory _values
    ) public {
        if (_confiscatees.length != _receivers.length || _confiscatees.length != _values.length)
            revert ERC20ConfiscatableMockLengthsNotEqual();

        if (_confiscatees.length > BATCH_LIMIT) revert ERC20ConfiscatableMockBatchCountTooLarge(_confiscatees.length);

        for (uint256 i = 0; i < _confiscatees.length; ++i) {
            confiscate(_confiscatees[i], _receivers[i], _values[i]);
        }
    }
}
