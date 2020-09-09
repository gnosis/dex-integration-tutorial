const BatchExchange = artifacts.require("BatchExchange")

module.exports = async (callback) => {
  try {
    const exchange = await BatchExchange.deployed()
    console.log("Aquired Batch Exchange", exchange.address)

    // Insert your code here!

    callback()
  } catch (error) {
    callback(error)
  }
}
