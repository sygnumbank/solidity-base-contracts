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
  const adminSlot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  const adm = web3.eth.getStorageAt(proxy.address, adminSlot);
  return adm;
}

async function getImplementation(proxy) {
  const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const impl = web3.eth.getStorageAt(proxy.address, implSlot);
  return impl;
}

module.exports = {
  assertRevert,
  getAdmin,
  getImplementation,
};
