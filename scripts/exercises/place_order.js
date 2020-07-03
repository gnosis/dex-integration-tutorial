const { getBatchExchange } = require("../util")

module.exports = async (callback) => {
  try {
    const exchange = await getBatchExchange(web3)
    console.log("Aquired Batch Exchange", exchange.address)

    // Insert your code here!

    callback()
  } catch (error) {
    callback(error)
  }
}
