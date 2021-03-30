/**
 * @title OperatorableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Contract mocking operator/admin/system/multisig/relay action.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../role/base/Operatorable.sol";

contract OperatorableMock is Operatorable {
    bool public OperatorAction;
    bool public SystemAction;
    bool public RelayAction;
    bool public MultisigAction;
    bool public AdminOrSystemAction;
    bool public OperatorOrSystemAction;
    bool public OperatorOrRelayAction;
    bool public AdminOrRelayAction;
    bool public OperatorOrSystemOrRelayAction;

    event RelayerCalled(address caller, bool action);

    /**
     * @dev Initialization instead of constructor to point to Operators contract.
     * @param _baseOperators BaseOperators contract address.
     */
    function setContract(address _baseOperators) external {
        super.initialize(_baseOperators);
    }

    /**
     * @dev Simulate operators action.
     */
    function operatorAction() external onlyOperator {
        OperatorAction = true;
    }

    /**
     * @dev Simulate system action.
     */
    function systemAction() external onlySystem {
        SystemAction = true;
    }

    /**
     * @dev Simulate multisig action.
     */
    function multisigAction() external onlyMultisig {
        MultisigAction = true;
    }

    /**
     * @dev Simulate relay action.
     */
    function relayAction() external onlyRelay {
        RelayAction = true;
        emit RelayerCalled(msg.sender, RelayAction);
    }

    /**
     * @dev Simulate admin or system action.
     */
    function adminOrSystemAction() external onlyAdminOrSystem {
        AdminOrSystemAction = true;
    }

    /**
     * @dev Simulate operator or system action.
     */
    function operatorOrSystemAction() external onlyOperatorOrSystem {
        OperatorOrSystemAction = true;
    }

    /**
     * @dev Simulate operator or relay action.
     */
    function operatorOrRelayAction() external onlyOperatorOrRelay {
        OperatorOrRelayAction = true;
        if (isRelay(msg.sender)) {
            emit RelayerCalled(msg.sender, OperatorOrRelayAction);
        }
    }

    /**
     * @dev Simulate admin or relay action.
     */
    function adminOrRelayAction() external onlyAdminOrRelay {
        AdminOrRelayAction = true;
        if (isRelay(msg.sender)) {
            emit RelayerCalled(msg.sender, AdminOrRelayAction);
        }
    }

    /**
     * @dev Simulate operator or system or relay action.
     */
    function operatorOrSystemOrRelayAction() external onlyOperatorOrSystemOrRelay {
        OperatorOrSystemOrRelayAction = true;
        if (isRelay(msg.sender)) {
            emit RelayerCalled(msg.sender, OperatorOrSystemOrRelayAction);
        }
    }
}
