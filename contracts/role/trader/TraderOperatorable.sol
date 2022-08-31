/**
 * @title TraderOperatorable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev TraderOperatorable contract stores TraderOperators contract address, and modifiers for
 *      contracts.
 */

pragma solidity ^0.8.0;

import "../interface/ITraderOperators.sol";
import "../base/Operatorable.sol";
import "../../helpers/Initializable.sol";

contract TraderOperatorable is Operatorable {
    ITraderOperators internal traderOperatorsInst;
    address private traderOperatorsPending;

    /**
     * @dev Error: "TraderOperatorable: caller is not trader"
     */
    error TraderOperatorableCallerNotTrader();

    /**
     * @dev Error: "TraderOperatorable: caller is not trader or operator or system"
     */
    error TraderOperatorableCallerNotTraderOrOperatorOrSystem();

    /**
     * @dev Error: "TraderOperatorable: address of new traderOperators contract can not be zero"
     */
    error TraderOperatorableNewTraderOperatorsAddressZero();

    /**
     * @dev Error: "TraderOperatorable: address of pending traderOperators contract can not be zero"
     */
    error TraderOperatorablePendingTraderOperatorsAddressZero();

    /**
     * @dev Error: "TraderOperatorable: should be called from new traderOperators contract"
     */
    error TraderOperatorableCallerNotNewTraderOperator();

    event TraderOperatorsContractChanged(address indexed caller, address indexed traderOperatorsAddress);
    event TraderOperatorsContractPending(address indexed caller, address indexed traderOperatorsAddress);

    /**
     * @dev Reverts if sender does not have the trader role associated.
     */
    modifier onlyTrader() {
        if (!isTrader(msg.sender)) revert TraderOperatorableCallerNotTrader();
        _;
    }

    /**
     * @dev Reverts if sender does not have the operator or trader role associated.
     */
    modifier onlyOperatorOrTraderOrSystem() {
        if (!isOperator(msg.sender) && !isTrader(msg.sender) && !isSystem(msg.sender))
            revert TraderOperatorableCallerNotTraderOrOperatorOrSystem();
        _;
    }

    /**
     * @dev Initialization instead of constructor, called once. The setTradersOperatorsContract function can be called only by Admin role with
     * confirmation through the operators contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _traderOperators TraderOperators contract address.
     */
    function initialize(address _baseOperators, address _traderOperators) public virtual initializer {
        super.initialize(_baseOperators);
        _setTraderOperatorsContract(_traderOperators);
    }

    /**
     * @dev Set the new the address of Operators contract, should be confirmed from operators contract by calling confirmFor(addr)
     * where addr is the address of current contract instance. This is done to prevent the case when the new contract address is
     * broken and control of the contract can be lost in such case
     * @param _traderOperators TradeOperators contract address.
     */
    function setTraderOperatorsContract(address _traderOperators) public onlyAdmin {
        if (_traderOperators == address(0)) revert TraderOperatorableNewTraderOperatorsAddressZero();

        traderOperatorsPending = _traderOperators;
        emit TraderOperatorsContractPending(msg.sender, _traderOperators);
    }

    /**
     * @dev The function should be called from new operators contract by admin to insure that traderOperatorsPending address
     *       is the real contract address.
     */
    function confirmTraderOperatorsContract() public {
        if (traderOperatorsPending == address(0)) revert TraderOperatorablePendingTraderOperatorsAddressZero();
        if (msg.sender != traderOperatorsPending) revert TraderOperatorableCallerNotNewTraderOperator();

        _setTraderOperatorsContract(traderOperatorsPending);
    }

    /**
     * @return The address of the TraderOperators contract.
     */
    function getTraderOperatorsContract() public view returns (address) {
        return address(traderOperatorsInst);
    }

    /**
     * @return The pending TraderOperators contract address
     */
    function getTraderOperatorsPending() public view returns (address) {
        return traderOperatorsPending;
    }

    /**
     * @return If '_account' has trader privileges.
     */
    function isTrader(address _account) public view returns (bool) {
        return traderOperatorsInst.isTrader(_account);
    }

    /** INTERNAL FUNCTIONS */
    function _setTraderOperatorsContract(address _traderOperators) internal {
        if (_traderOperators == address(0)) revert TraderOperatorableNewTraderOperatorsAddressZero();

        traderOperatorsInst = ITraderOperators(_traderOperators);
        emit TraderOperatorsContractChanged(msg.sender, _traderOperators);
    }
}
