/**
 * @title Freezable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Freezable contract to freeze functionality for particular addresses.  Freezing/unfreezing is controlled
 *       by operators in Operatorable contract which is initialized with the relevant BaseOperators address.
 */

pragma solidity 0.5.12;

import "../role/base/Operatorable.sol";

contract Freezable is Operatorable {
    mapping(address => bool) public frozen;

    event FreezeToggled(address indexed account, bool frozen);

    /**
     * @dev Reverts if address is empty.
     * @param _address address to validate.
     */
    modifier onlyValidAddress(address _address) {
        require(_address != address(0), "Freezable: Empty address");
        _;
    }

    /**
     * @dev Reverts if account address is frozen.
     * @param _account address to validate is not frozen.
     */
    modifier whenNotFrozen(address _account) {
        require(!frozen[_account], "Freezable: account is frozen");
        _;
    }

    /**
     * @dev Reverts if account address is not frozen.
     * @param _account address to validate is frozen.
     */
    modifier whenFrozen(address _account) {
        require(frozen[_account], "Freezable: account is not frozen");
        _;
    }

    /**
     * @dev Getter to determine if address is frozen.
     * @param _account address to determine if frozen or not.
     * @return bool is frozen
     */
    function isFrozen(address _account) public view returns (bool) {
        return frozen[_account];
    }

    /**
     * @dev Toggle freeze/unfreeze on _account address, with _toggled being true/false.
     * @param _account address to toggle.
     * @param _toggled freeze/unfreeze.
     */
    function toggleFreeze(address _account, bool _toggled) public onlyValidAddress(_account) onlyOperator {
        frozen[_account] = _toggled;
        emit FreezeToggled(_account, _toggled);
    }

    /**
     * @dev Batch freeze/unfreeze multiple addresses, with _toggled being true/false.
     * @param _addresses address array.
     * @param _toggled freeze/unfreeze.
     */
    function batchToggleFreeze(address[] memory _addresses, bool _toggled) public {
        require(_addresses.length <= 256, "Freezable: batch count is greater than 256");
        for (uint256 i = 0; i < _addresses.length; i++) {
            toggleFreeze(_addresses[i], _toggled);
        }
    }
}
