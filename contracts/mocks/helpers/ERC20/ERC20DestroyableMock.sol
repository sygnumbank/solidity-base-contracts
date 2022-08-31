/**
 * @title ERC20DestroyableMock
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Mock contract for validating whitelist functionality when overloading ERC20 functions.
 *      This contract is excluded from the audit.
 */

pragma solidity ^0.8.0;

import "../../../helpers/ERC20/ERC20Destroyable.sol";
import "../../../helpers/ERC20/ERC20Whitelist.sol";

contract ERC20DestroyableMock is ERC20Destroyable, ERC20Whitelist {}
