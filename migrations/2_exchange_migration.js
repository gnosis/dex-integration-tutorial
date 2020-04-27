const migrateBatchExchange = require("@gnosis.pm/dex-contracts/src/migration/PoC_dfusion")

module.exports = async function(deployer, network, accounts) {
  if (network === "development") {
    console.log("Migrating Batch Exchange")
    await migrateBatchExchange({
      artifacts,
      deployer,
      network,
      account: accounts[0],
      web3,
    })
  } else {
    // eslint-disable-next-line no-console
    console.log("Not in development, so nothing to do. Current network is %s", network)
  }
}