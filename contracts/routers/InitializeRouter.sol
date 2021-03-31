/**
 * @title InitializeRouter
 * @author Team 3301 <team3301@sygnum.com>
 * @dev InitializeRouter contract, that allows one individual transaction to initialize all role contracts.
 */

pragma solidity 0.5.12;

import "../role/base/Operatorable.sol";
import "../helpers/interface/IInitialize.sol";

contract InitializeRouter is Operatorable {
    function initializeContracts(
        address _baseOperators,
        address _raiseOperators,
        address _traderOperators,
        address _blockerOperators,
        address _dchf,
        address _whitelist
    ) public onlyAdmin {
        require(
            _raiseOperators != address(0) &&
                _traderOperators != address(0) &&
                _blockerOperators != address(0) &&
                _dchf != address(0) &&
                _whitelist != address(0),
            "InitializeRouter: contract addresses cannot be empty"
        );
        address baseOperators;
        if (_baseOperators == address(0)) {
            baseOperators = getOperatorsContract();
        } else {
            baseOperators = _baseOperators;
        }
        IInitialize(_raiseOperators).initialize(baseOperators);
        IInitialize(_traderOperators).initialize(baseOperators);
        IInitialize(_blockerOperators).initialize(baseOperators);
        IInitialize(_dchf).initialize(baseOperators);
        IInitialize(_whitelist).initialize(baseOperators);
    }

    function initializeOperators(
        address _baseOperators,
        address _raiseOperators,
        address _traderOperators,
        address _blockerOperators
    ) public {
        require(
            _raiseOperators != address(0) && _traderOperators != address(0) && _blockerOperators != address(0),
            "InitializeRouter: contract addresses cannot be empty"
        );
        address baseOperators;
        if (_baseOperators == address(0)) {
            baseOperators = getOperatorsContract();
        } else {
            baseOperators = _baseOperators;
        }
        IInitialize(_raiseOperators).initialize(baseOperators);
        IInitialize(_traderOperators).initialize(baseOperators);
        IInitialize(_blockerOperators).initialize(baseOperators);
    }
}
