/**
 * @title MultisigMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract used for mimicking a multisig contract.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

contract MultisigMock {
    bool public aVariable;

    constructor() public {
        aVariable = true;
    }
}
