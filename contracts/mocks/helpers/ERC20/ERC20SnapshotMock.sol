/**
 * @title ERC20SnapshotMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for snapshot functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity 0.5.12;

import "../../../helpers/ERC20/ERC20Snapshot.sol";

contract ERC20SnapshotMock is ERC20Snapshot {
    /**
     * @dev Access internal mint function.
     * @param account Account to mint funds to.
     * @param value amount to mint.
     */
    function mint(address account, uint256 value) public {
        super._mint(account, value);
    }

    /**
     * @dev Access internal burn function.
     * @param amount to burn.
     */
    function burn(uint256 amount) public {
        super._burn(msg.sender, amount);
    }

    /**
     * @dev Access internal burnFor function.
     * @param account Account to burn funds from.
     * @param amount to burn.
     */
    function burnFor(address account, uint256 amount) public {
        super._burnFor(account, amount);
    }

    /**
     * @dev Access internal burnFrom function.
     * @param account Account to burn funds from.
     * @param amount to burn.
     */
    function burnFrom(address account, uint256 amount) public {
        super._burnFrom(account, amount);
    }

    /**
     * @dev Access internal confiscate function.
     * @param confiscatee Account to confiscate funds from.
     * @param confiscatee Account to transfer funds to.
     * @param amount to confiscate.
     */
    function confiscate(
        address confiscatee,
        address receiver,
        uint256 amount
    ) public {
        super._confiscate(confiscatee, receiver, amount);
    }
}
