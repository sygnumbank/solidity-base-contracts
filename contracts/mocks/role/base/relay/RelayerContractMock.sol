/**
 * @title RelayerContractMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking relayer contract actions to call other contracts and validate
 * that these actions execute correctly within the Relayer role model.
 */

pragma solidity 0.5.12;

import "../OperatorableMock.sol";

contract RelayerContractMock {
    /**
     * @dev Call relay action in other contract.
     * @param _contract contract to call action.
     */
    function callContractRelayAction(address _contract) public {
        OperatorableMock(_contract).relayAction();
    }

    /**
     * @dev Call relay action in other contract that can accept operator or relay action.
     * @param _contract contract to call action.
     */
    function callContractOperatorOrRelayAction(address _contract) public {
        OperatorableMock(_contract).operatorOrRelayAction();
    }

    /**
     * @dev Call relay action in other contract that can acceept admin or relay action.
     * @param _contract contract to call action.
     */
    function callContractAdminOrRelayAction(address _contract) public {
        OperatorableMock(_contract).adminOrRelayAction();
    }

    /**
     * @dev Call relay action in other contract that can accept operator or system or relay action.
     * @param _contract contract to call action.
     */
    function callContractOperatorOrSystemOrRelayAction(address _contract) public {
        OperatorableMock(_contract).operatorOrSystemOrRelayAction();
    }
}
