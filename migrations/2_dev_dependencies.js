const migrateBatchExchange = require("@gnosis.pm/dex-contracts/src/migration/PoC_dfusion")

module.exports = async function (deployer, network, accounts) {
  console.log("Migrating Batch Exchange")
  const artefact = await migrateBatchExchange({
    artifacts,
    deployer,
    network,
    account: accounts[0],
    web3,
  })

  const Artifactor = require("@truffle/artifactor")
  const artifactor = new Artifactor("build/contracts/")
  await artifactor.save(artefact)
}
