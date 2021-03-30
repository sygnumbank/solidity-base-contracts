/**
 * @title SygnumProxy
 * @author Team 3301 <team3301@sygnum.com>
 * @dev Proxies Sygnum contract calls and enables Sygnum upgradability.
 */
pragma solidity 0.5.12;

import "@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol";

contract SygnumProxy is AdminUpgradeabilityProxy {
    /* solhint-disable no-empty-blocks */
    constructor(
        address implementation,
        address proxyOwnerAddr,
        bytes memory data
    ) public AdminUpgradeabilityProxy(implementation, proxyOwnerAddr, data) {}
    /* solhint-enable no-empty-blocks */
}
