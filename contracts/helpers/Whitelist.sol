/**
 * @title Whitelist
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Whitelist contract with whitelist/unwhitelist functionality for particular addresses.  Whitelisting/unwhitelisting
 *      is controlled by operators/system/relays in Operatorable contract.
 */

pragma solidity ^0.8.0;

import "../role/base/Operatorable.sol";
import "./interface/IWhitelistable.sol";

contract Whitelist is Operatorable {
    mapping(address => bool) public whitelisted;

    /**
     * @dev Error: "Whitelist: account is not whitelisted"
     */
    error WhitelistAccountNotWhitelisted(address _account);

    /**
     * @dev Error: "Whitelist: invalid address"
     */
    error WhitelistInvalidAddress();

    /**
     * @dev Error: "Whitelist: batch count is greater than 256"
     */
    error WhitelistBatchCountTooLarge(uint256 _batchCount);

    event WhitelistToggled(address indexed account, bool whitelisted);

    /**
     * @dev Reverts if _account is not whitelisted.
     * @param _account address to determine if whitelisted.
     */
    modifier whenWhitelisted(address _account) {
        if (!isWhitelisted(_account)) revert WhitelistAccountNotWhitelisted(_account);
        _;
    }

    /**
     * @dev Reverts if address is empty.
     * @param _address address to validate.
     */
    modifier onlyValidAddress(address _address) {
        if (_address == address(0)) revert WhitelistInvalidAddress();
        _;
    }

    /**
     * @dev Getter to determine if address is whitelisted.
     * @param _account address to determine if whitelisted or not.
     * @return bool is whitelisted
     */
    function isWhitelisted(address _account) public view virtual returns (bool) {
        return whitelisted[_account];
    }

    /**
     * @dev Toggle whitelisted/unwhitelisted on _account address, with _toggled being true/false.
     * @param _account address to toggle.
     * @param _toggled whitelist/unwhitelist.
     */
    function toggleWhitelist(address _account, bool _toggled)
        public
        virtual
        onlyValidAddress(_account)
        onlyOperatorOrSystemOrRelay
    {
        whitelisted[_account] = _toggled;
        emit WhitelistToggled(_account, whitelisted[_account]);
    }

    /**
     * @dev Batch whitelisted/unwhitelist multiple addresses, with _toggled being true/false.
     * @param _addresses address array.
     * @param _toggled whitelist/unwhitelist.
     */
    function batchToggleWhitelist(address[] memory _addresses, bool _toggled) public virtual {
        if (_addresses.length > 256) revert WhitelistBatchCountTooLarge(_addresses.length);

        for (uint256 i = 0; i < _addresses.length; ++i) {
            toggleWhitelist(_addresses[i], _toggled);
        }
    }

    /**
     * @dev Confirms whitelist contract address once active.
     * @param _address Whitelistable contract addres.
     */
    function confirmFor(address _address) public virtual onlyAdmin {
        if (_address == address(0)) revert WhitelistInvalidAddress();
        IWhitelistable(_address).confirmWhitelistContract();
    }
}
