const Artifactor = require("@truffle/artifactor")
const migrateBatchExchange = require("@gnosis.pm/dex-contracts/src/migration/migrate_BatchExchange")
const truffleContract = require("@truffle/contract")
const Migrations = artifacts.require("Migrations")

const makeContract = function (buildInfo) {
  const Contract = truffleContract(buildInfo)
  Contract.setProvider(web3.currentProvider)
  // Borrow dynamic config from native contract
  Contract.defaults(Migrations.defaults())
  Contract.setNetwork(Migrations.network_id)
  return Contract
}

module.exports = async function (deployer, network, accounts) {
  const BatchExchange = makeContract(require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange.json"))

  await migrateBatchExchange({
    BatchExchange,
    artifacts,
    deployer,
    network,
    account: accounts[0],
    web3,
  })
  const artifactor = new Artifactor("node_modules/@gnosis.pm/dex-contracts/build/contracts/")
  await artifactor.save(BatchExchange)
}
