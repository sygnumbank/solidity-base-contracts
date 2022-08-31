async function assertRevert(promise) {
  try {
    await promise;
    assert.fail("Expected revert not received");
  } catch (error) {
    const revertFound = error.message.search("revert") >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
}

async function getAdmin(proxy) {
  // EIP-1967 admin slot: bytes32(uint256(keccak256('eip1967.proxy.admin')) - 1)
  const adminSlot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  let adm = await web3.eth.getStorageAt(proxy.address, adminSlot);
  adm = web3.eth.abi.decodeParameter("address", adm);
  return adm;
}

async function getImplementation(proxy) {
  // EIP-1967 implementation slot: bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
  const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  let impl = await web3.eth.getStorageAt(proxy.address, implSlot);
  impl = web3.eth.abi.decodeParameter("address", impl);
  return impl;
}

module.exports = {
  assertRevert,
  getAdmin,
  getImplementation,
};
