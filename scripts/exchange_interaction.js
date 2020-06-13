const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)
BatchExchange.setProvider(web3.currentProvider)

module.exports = async (callback) => {
  try {
    const exchange = await BatchExchange.deployed()
    console.log("Aquired Batch Exchange", exchange.address)

    const batchId = (await exchange.getCurrentBatchId.call()).toNumber()
    console.log("Current Batch", batchId)

    callback()
  } catch (error) {
    callback(error)
  }
}
