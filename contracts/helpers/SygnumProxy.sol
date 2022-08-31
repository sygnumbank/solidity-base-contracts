// SPDX-License-Identifier: UNLICENSED

/**
 * @title SygnumProxy
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Proxies Sygnum contract calls and enables Sygnum upgradability.
 */
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract SygnumProxy is TransparentUpgradeableProxy {
    /* solhint-disable no-empty-blocks */
    constructor(
        address implementation,
        address proxyOwnerAddr,
        bytes memory data
    ) TransparentUpgradeableProxy(implementation, proxyOwnerAddr, data) {}
    /* solhint-enable no-empty-blocks */
}
