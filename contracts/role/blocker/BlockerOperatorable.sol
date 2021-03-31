/**
 * @title BlockerOperatorable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev BlockerOperatorable contract stores BlockerOperators contract address, and modifiers for
 *      contracts.
 */

pragma solidity 0.5.12;

import "../interface/IBlockerOperators.sol";
import "../base/Operatorable.sol";
import "../../helpers/Initializable.sol";

contract BlockerOperatorable is Operatorable {
    IBlockerOperators internal blockerOperatorsInst;
    address private blockerOperatorsPending;

    event BlockerOperatorsContractChanged(address indexed caller, address indexed blockerOperatorAddress);
    event BlockerOperatorsContractPending(address indexed caller, address indexed blockerOperatorAddress);

    /**
     * @dev Reverts if sender does not have the blocker role associated.
     */
    modifier onlyBlocker() {
        require(isBlocker(msg.sender), "BlockerOperatorable: caller is not blocker role");
        _;
    }

    /**
     * @dev Reverts if sender does not have the blocker or operator role associated.
     */
    modifier onlyBlockerOrOperator() {
        require(
            isBlocker(msg.sender) || isOperator(msg.sender),
            "BlockerOperatorable: caller is not blocker or operator role"
        );
        _;
    }

    /**
     * @dev Initialization instead of constructor, called once. The setBlockerOperatorsContract function can be called only by Admin role with
     * confirmation through the operators contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _blockerOperators BlockerOperators contract address.
     */
    function initialize(address _baseOperators, address _blockerOperators) public initializer {
        super.initialize(_baseOperators);
        _setBlockerOperatorsContract(_blockerOperators);
    }

    /**
     * @dev Set the new the address of BlockerOperators contract, should be confirmed from BlockerOperators contract by calling confirmFor(addr)
     * where addr is the address of current contract instance. This is done to prevent the case when the new contract address is
     * broken and control of the contract can be lost in such case.
     * @param _blockerOperators BlockerOperators contract address.
     */
    function setBlockerOperatorsContract(address _blockerOperators) public onlyAdmin {
        require(
            _blockerOperators != address(0),
            "BlockerOperatorable: address of new blockerOperators contract can not be zero."
        );
        blockerOperatorsPending = _blockerOperators;
        emit BlockerOperatorsContractPending(msg.sender, _blockerOperators);
    }

    /**
     * @dev The function should be called from new BlockerOperators contract by admin to insure that blockerOperatorsPending address
     *       is the real contract address.
     */
    function confirmBlockerOperatorsContract() public {
        require(
            blockerOperatorsPending != address(0),
            "BlockerOperatorable: address of pending blockerOperators contract can not be zero"
        );
        require(
            msg.sender == blockerOperatorsPending,
            "BlockerOperatorable: should be called from new blockerOperators contract"
        );
        _setBlockerOperatorsContract(blockerOperatorsPending);
    }

    /**
     * @return The address of the BlockerOperators contract.
     */
    function getBlockerOperatorsContract() public view returns (address) {
        return address(blockerOperatorsInst);
    }

    /**
     * @return The pending BlockerOperators contract address
     */
    function getBlockerOperatorsPending() public view returns (address) {
        return blockerOperatorsPending;
    }

    /**
     * @return If '_account' has blocker privileges.
     */
    function isBlocker(address _account) public view returns (bool) {
        return blockerOperatorsInst.isBlocker(_account);
    }

    /** INTERNAL FUNCTIONS */
    function _setBlockerOperatorsContract(address _blockerOperators) internal {
        require(
            _blockerOperators != address(0),
            "BlockerOperatorable: address of new blockerOperators contract can not be zero"
        );
        blockerOperatorsInst = IBlockerOperators(_blockerOperators);
        emit BlockerOperatorsContractChanged(msg.sender, _blockerOperators);
    }
}
