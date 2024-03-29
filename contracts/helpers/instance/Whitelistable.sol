// SPDX-License-Identifier: UNLICENSED

/**
 * @title Whitelistable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Whitelistable contract stores the Whitelist contract address, and modifiers for
 *       contracts.
 */

pragma solidity ^0.8.0;

import "../../role/base/Operatorable.sol";
import "../interface/IWhitelist.sol";
import "../Initializable.sol";

contract Whitelistable is Initializable, Operatorable {
    IWhitelist internal whitelistInst;
    address private whitelistPending;

    /**
     * @dev Error: "Whitelistable: account is not whitelisted"
     */
    error WhitelistableAccountNotWhitelisted();

    /**
     * @dev Error: "Whitelistable: address of new whitelist contract can not be zero"
     */
    error WhitelistableWhitelistContractZeroAddress();

    /**
     * @dev Error:  "Whitelistable: should be called from new whitelist contract"
     */
    error WhitelistableCallerNotWhitelistContract(address _caller);

    event WhitelistContractChanged(address indexed caller, address indexed whitelistAddress);
    event WhitelistContractPending(address indexed caller, address indexed whitelistAddress);

    /**
     * @dev Reverts if _account is not whitelisted.
     * @param _account address to determine if whitelisted.
     */
    modifier whenWhitelisted(address _account) {
        if (!isWhitelisted(_account)) revert WhitelistableAccountNotWhitelisted();
        _;
    }

    /**
     * @dev Initialization instead of constructor, called once. The setWhitelistContract function can be called only by Admin role with
     *       confirmation through the whitelist contract.
     * @param _whitelist Whitelist contract address.
     * @param _baseOperators BaseOperators contract address.
     */
    function initialize(address _baseOperators, address _whitelist) public virtual initializer {
        _setOperatorsContract(_baseOperators);
        _setWhitelistContract(_whitelist);
    }

    /**
     * @dev Set the new the address of Whitelist contract, should be confirmed from whitelist contract by calling confirmFor(addr)
     *       where addr is the address of current contract instance. This is done to prevent the case when the new contract address is
     *       broken and control of the contract can be lost in such case
     * @param _whitelist Whitelist contract address.
     */
    function setWhitelistContract(address _whitelist) public onlyAdmin {
        if (_whitelist == address(0)) revert WhitelistableWhitelistContractZeroAddress();

        whitelistPending = _whitelist;
        emit WhitelistContractPending(msg.sender, _whitelist);
    }

    /**
     * @dev The function should be called from new whitelist contract by admin to insure that whitelistPending address
     *       is the real contract address.
     */
    function confirmWhitelistContract() public {
        if (whitelistPending == address(0)) revert WhitelistableWhitelistContractZeroAddress();

        if (msg.sender != whitelistPending) revert WhitelistableCallerNotWhitelistContract(msg.sender);

        _setWhitelistContract(whitelistPending);
    }

    /**
     * @return The address of the Whitelist contract.
     */
    function getWhitelistContract() public view returns (address) {
        return address(whitelistInst);
    }

    /**
     * @return The pending address of the Whitelist contract.
     */
    function getWhitelistPending() public view returns (address) {
        return whitelistPending;
    }

    /**
     * @return If '_account' is whitelisted.
     */
    function isWhitelisted(address _account) public view returns (bool) {
        return whitelistInst.isWhitelisted(_account);
    }

    /** INTERNAL FUNCTIONS */
    function _setWhitelistContract(address _whitelist) internal {
        if (_whitelist == address(0)) revert WhitelistableWhitelistContractZeroAddress();

        whitelistInst = IWhitelist(_whitelist);
        emit WhitelistContractChanged(msg.sender, _whitelist);
    }
}
