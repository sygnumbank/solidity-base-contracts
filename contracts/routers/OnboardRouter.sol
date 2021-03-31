/**
 * @title OnboardRouter
 * @author Team 3301 <team3301@sygnum.com>
 * @dev OnboardRouter contract, that allows one individual transaction to onboard a particular subset of users onto
 *      the Sygnum platform, instead of having to initiate X amount of transactions.
 */

pragma solidity 0.5.12;

import "../helpers/interface/IWhitelist.sol";
import "../role/base/Operatorable.sol";
import "../role/interface/IBaseOperators.sol";
import "../role/interface/IRaiseOperators.sol";
import "../role/interface/ITraderOperators.sol";
import "../role/interface/IBlockerOperators.sol";

contract OnboardRouter is Operatorable {
    IWhitelist internal whitelistInst;
    IRaiseOperators internal raiseOperatorsInst;
    ITraderOperators internal traderOperatorsInst;
    IBlockerOperators internal blockerOperatorsInst;

    event WhitelistContractChanged(address indexed caller, address indexed whitelistAddress);
    event BaseOperatorsContractChanged(address indexed caller, address indexed baseOperatorsAddress);
    event RaiseOperatorsContractChanged(address indexed caller, address indexed raiseOperatorsAddress);
    event TraderOperatorsContractChanged(address indexed caller, address indexed traderOperatorsAddress);
    event BlockerOperatorsContractChanged(address indexed caller, address indexed blockerOperatorsAddress);

    /**
     * @dev Initialization instead of constructor, called once. The setOperatorsContract function can be called only by Admin role with
     *       confirmation through the operators contract.
     * @param _baseOperators BaseOperators contract address.
     * @param _raiseOperators RaiseOperators contract address.
     * @param _traderOperators TraderOperators contract address.
     * @param _blockerOperators BlockerOperators contract address.
     */
    function initialize(
        address _whitelist,
        address _baseOperators,
        address _raiseOperators,
        address _traderOperators,
        address _blockerOperators
    ) public initializer {
        _setWhitelistContract(_whitelist);
        _setBaseOperatorsContract(_baseOperators);
        _setRaiseOperatorsContract(_raiseOperators);
        _setTraderOperatorsContract(_traderOperators);
        _setBlockerOperatorsContract(_blockerOperators);
    }

    /**
     * @dev Admin can give '_account' address system privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given system privileges.
     * @param _whitelist Whitelist contract address.
     */
    function onboardSystem(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.addSystem(_account);
    }

    /**
     * @dev Admin can revoke '_account' address system privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be revoked system privileges.
     * @param _whitelist Whitelist contract address.
     */
    function deboardSystem(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.removeSystem(_account);
    }

    /**
     * @dev Admin can give '_account' address super admin privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given super admin privileges.
     * @param _whitelist Whitelist contract address.
     */
    function onboardSuperAdmin(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.addOperatorAndAdmin(_account);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can revoke '_account' address super admin privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be revoked super admin privileges.
     * @param _whitelist Whitelist contract address.
     */
    function deboardSuperAdmin(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.removeOperatorAndAdmin(_account);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Operator or System can give '_account' address investor privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given investor privileges.
     * @param _whitelist Whitelist contract address.
     */
    function onboardInvestor(address _account, address _whitelist) public onlyOperatorOrSystem {
        _toggleWhitelist(_account, _whitelist, true);
        raiseOperatorsInst.addInvestor(_account);
    }

    /**
     * @dev Operator or System can revoke '_account' address investor privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be revoked investor privileges.
     * @param _whitelist Whitelist contract address.
     */
    function deboardInvestor(address _account, address _whitelist) public onlyOperatorOrSystem {
        _toggleWhitelist(_account, _whitelist, false);
        raiseOperatorsInst.removeInvestor(_account);
    }

    /**
     * @dev Admin can give '_account' address trader privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function onboardTrader(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can revoke '_account' address trader privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be revoked trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function deboardTrader(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Admin can give '_account' address blocker privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given blocker privileges.
     * @param _whitelist Whitelist contract address.
     */
    function onboardBlocker(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        blockerOperatorsInst.addBlocker(_account);
    }

    /**
     * @dev Admin can revoke '_account' address blocker privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be revoked blocker privileges.
     * @param _whitelist Whitelist contract address.
     */
    function deboardBlocker(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        blockerOperatorsInst.removeBlocker(_account);
    }

    /**
     * @dev Admin can change admin '_account' address to only trader privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeAdminToTrader(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.removeAdmin(_account);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can change admin '_account' address to superAdmin privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeAdminToSuperAdmin(address _account, address _whitelist) public onlyAdmin {
        require(isAdmin(_account), "OnboardRouter: selected account does not have admin privileges");

        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.addOperator(_account);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can change operator '_account' address to trader privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeOperatorToTrader(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.removeOperator(_account);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can change operator '_account' address to superAdmin privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeOperatorToSuperAdmin(address _account, address _whitelist) public onlyAdmin {
        require(isOperator(_account), "OnboardRouter: selected account does not have operator privileges");

        _toggleWhitelist(_account, _whitelist, true);
        operatorsInst.addAdmin(_account);
        traderOperatorsInst.addTrader(_account);
    }

    /**
     * @dev Admin can change trader '_account' address to admin privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeTraderToAdmin(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.addAdmin(_account);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Admin can change trader '_account' address to operator privileges, whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeTraderToOperator(address _account, address _whitelist) public onlyAdmin {
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.addOperator(_account);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Admin can change superadmin '_account' address to admin privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeSuperAdminToAdmin(address _account, address _whitelist) public onlyAdmin {
        require(isAdmin(_account), "OnboardRouter: account is not admin");
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.removeOperator(_account);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Admin can change superadmin '_account' address to operator privileges, de-whitelist them on the shared whitelist contract, and the passed in whitelist address i.e. Equity Token, or the default whitelist.
     * @param _account address that should be given trader privileges.
     * @param _whitelist Whitelist contract address.
     */
    function changeSuperAdminToOperator(address _account, address _whitelist) public onlyAdmin {
        require(isAdmin(_account), "OnboardRouter: account is not admin");
        _toggleWhitelist(_account, _whitelist, false);
        operatorsInst.removeAdmin(_account);
        traderOperatorsInst.removeTrader(_account);
    }

    /**
     * @dev Change address of Whitelist contract.
     * @param _whitelist Whitelist contract address.
     */
    function changeWhitelistContract(address _whitelist) public onlyAdmin {
        _setWhitelistContract(_whitelist);
    }

    /**
     * @dev Change address of BaseOperators contract.
     * @param _baseOperators BaseOperators contract address.
     */
    function changeBaseOperatorsContract(address _baseOperators) public onlyAdmin {
        _setBaseOperatorsContract(_baseOperators);
    }

    /**
     * @dev Change address of RaiseOperators contract.
     * @param _raiseOperators RaiseOperators contract address.
     */
    function changeRaiseOperatorsContract(address _raiseOperators) public onlyAdmin {
        _setRaiseOperatorsContract(_raiseOperators);
    }

    /**
     * @dev Change address of TraderOperators contract.
     * @param _traderOperators TraderOperators contract address.
     */
    function changeTraderOperatorsContract(address _traderOperators) public onlyAdmin {
        _setTraderOperatorsContract(_traderOperators);
    }

    /**
     * @dev Change address of BlockerOperators contract.
     * @param _blockerOperators BlockerOperators contract address.
     */
    function changeBlockerOperatorsContract(address _blockerOperators) public onlyAdmin {
        _setBlockerOperatorsContract(_blockerOperators);
    }

    /**
     * @return Stored address of the Whitelist contract.
     */
    function getWhitelistContract() public view returns (address) {
        return address(whitelistInst);
    }

    /**
     * @return Stored address of the BaseOperators contract.
     */
    function getBaseOperatorsContract() public view returns (address) {
        return address(operatorsInst);
    }

    /**
     * @return Stored address of the RaiseOperators contract.
     */
    function getRaiseOperatorsContract() public view returns (address) {
        return address(raiseOperatorsInst);
    }

    /**
     * @return Stored address of the TraderOperators contract.
     */
    function getTraderOperatorsContract() public view returns (address) {
        return address(traderOperatorsInst);
    }

    /**
     * @return Stored address of the BlockerOperators contract.
     */
    function getBlockerOperatorsContract() public view returns (address) {
        return address(blockerOperatorsInst);
    }

    /** INTERNAL FUNCTIONS */
    function _toggleWhitelist(
        address _account,
        address _whitelist,
        bool _toggle
    ) internal {
        whitelistInst.toggleWhitelist(_account, _toggle);
        if (_whitelist != address(0)) {
            _toggleSecondaryWhitelist(_account, _whitelist, _toggle); // non-default
        }
    }

    function _toggleSecondaryWhitelist(
        address _account,
        address _whitelist,
        bool _toggle
    ) internal {
        IWhitelist(_whitelist).toggleWhitelist(_account, _toggle);
    }

    function _setWhitelistContract(address _whitelist) internal {
        require(_whitelist != address(0), "OnboardRouter: address of new whitelist contract cannot be zero");
        whitelistInst = IWhitelist(_whitelist);
        emit WhitelistContractChanged(msg.sender, _whitelist);
    }

    function _setBaseOperatorsContract(address _baseOperators) internal {
        require(_baseOperators != address(0), "OnboardRouter: address of new baseOperators contract cannot be zero");
        operatorsInst = IBaseOperators(_baseOperators);
        emit BaseOperatorsContractChanged(msg.sender, _baseOperators);
    }

    function _setRaiseOperatorsContract(address _raiseOperators) internal {
        require(_raiseOperators != address(0), "OnboardRouter: address of new raiseOperators contract cannot be zero");
        raiseOperatorsInst = IRaiseOperators(_raiseOperators);
        emit RaiseOperatorsContractChanged(msg.sender, _raiseOperators);
    }

    function _setTraderOperatorsContract(address _traderOperators) internal {
        require(
            _traderOperators != address(0),
            "OnboardRouter: address of new traderOperators contract cannot be zero"
        );
        traderOperatorsInst = ITraderOperators(_traderOperators);
        emit TraderOperatorsContractChanged(msg.sender, _traderOperators);
    }

    function _setBlockerOperatorsContract(address _blockerOperators) internal {
        require(
            _blockerOperators != address(0),
            "OnboardRouter: address of new blockerOperators contract cannot be zero"
        );
        blockerOperatorsInst = IBlockerOperators(_blockerOperators);
        emit BlockerOperatorsContractChanged(msg.sender, _blockerOperators);
    }
}
