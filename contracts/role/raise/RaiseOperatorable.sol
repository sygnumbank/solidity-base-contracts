/**
 * @title RaiseOperatorable
 * @author Team 3301 <team3301@sygnum.com>
 * @dev RaiseOperatorable contract stores RaiseOperators contract address, and modifiers for
 *      contracts.
 */

pragma solidity 0.5.12;

import "../interface/IRaiseOperators.sol";
import "../base/Operatorable.sol";
import "../../helpers/Initializable.sol";

contract RaiseOperatorable is Operatorable {
    IRaiseOperators internal raiseOperatorsInst;
    address private raiseOperatorsPending;

    event RaiseOperatorsContractChanged(address indexed caller, address indexed raiseOperatorsAddress);
    event RaiseOperatorsContractPending(address indexed caller, address indexed raiseOperatorsAddress);

    /**
     * @dev Reverts if sender does not have the investor role associated.
     */
    modifier onlyInvestor() {
        require(isInvestor(msg.sender), "RaiseOperatorable: caller is not investor");
        _;
    }

    /**
     * @dev Reverts if sender does not have the issuer role associated.
     */
    modifier onlyIssuer() {
        require(isIssuer(msg.sender), "RaiseOperatorable: caller is not issuer");
        _;
    }

    /**
     * @dev Initialization instead of constructor, called once. The setOperatorsContract function can be called only by Admin role with
     * confirmation through the operators contract.
     * @param _baseOperators BaseOperators contract address.
     */
    function initialize(address _baseOperators, address _raiseOperators) public initializer {
        super.initialize(_baseOperators);
        _setRaiseOperatorsContract(_raiseOperators);
    }

    /**
     * @dev Set the new the address of Operators contract, should be confirmed from operators contract by calling confirmFor(addr)
     * where addr is the address of current contract instance. This is done to prevent the case when the new contract address is
     *broken and control of the contract can be lost in such case
     * @param _raiseOperators RaiseOperators contract address.
     */
    function setRaiseOperatorsContract(address _raiseOperators) public onlyAdmin {
        require(
            _raiseOperators != address(0),
            "RaiseOperatorable: address of new raiseOperators contract can not be zero"
        );
        raiseOperatorsPending = _raiseOperators;
        emit RaiseOperatorsContractPending(msg.sender, _raiseOperators);
    }

    /**
     * @dev The function should be called from new operators contract by admin to insure that operatorsPending address
     *       is the real contract address.
     */
    function confirmRaiseOperatorsContract() public {
        require(
            raiseOperatorsPending != address(0),
            "RaiseOperatorable: address of pending raiseOperators contract can not be zero"
        );
        require(
            msg.sender == raiseOperatorsPending,
            "RaiseOperatorable: should be called from new raiseOperators contract"
        );
        _setRaiseOperatorsContract(raiseOperatorsPending);
    }

    /**
     * @return The address of the RaiseOperators contract.
     */
    function getRaiseOperatorsContract() public view returns (address) {
        return address(raiseOperatorsInst);
    }

    /**
     * @return The pending RaiseOperators contract address
     */
    function getRaiseOperatorsPending() public view returns (address) {
        return raiseOperatorsPending;
    }

    /**
     * @return If '_account' has investor privileges.
     */
    function isInvestor(address _account) public view returns (bool) {
        return raiseOperatorsInst.isInvestor(_account);
    }

    /**
     * @return If '_account' has issuer privileges.
     */
    function isIssuer(address _account) public view returns (bool) {
        return raiseOperatorsInst.isIssuer(_account);
    }

    /** INTERNAL FUNCTIONS */
    function _setRaiseOperatorsContract(address _raiseOperators) internal {
        require(
            _raiseOperators != address(0),
            "RaiseOperatorable: address of new raiseOperators contract can not be zero"
        );
        raiseOperatorsInst = IRaiseOperators(_raiseOperators);
        emit RaiseOperatorsContractChanged(msg.sender, _raiseOperators);
    }
}
