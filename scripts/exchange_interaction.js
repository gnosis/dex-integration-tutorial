const BatchExchange = artifacts.require("BatchExchange")

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
