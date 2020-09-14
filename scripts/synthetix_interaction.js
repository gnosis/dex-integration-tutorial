const { fromWeiString, getSynthetixExchange } = require("./util")

module.exports = async (callback) => {
  try {
    // Note that the snxjs object is not avaialble on local networks
    const snxjs = await getSynthetixExchange(web3)
    console.log("Initialized instance of SynthetixJS")

    console.log("sETH token found at address", snxjs.sETH.contract.address)
    console.log("sUSD token found at address", snxjs.sUSD.contract.address)

    const sETHKey = snxjs.sETH.currencyKey()
    const exchangeRate = await snxjs.ExchangeRates.rateForCurrency(sETHKey)

    // This value in in Wei, so we convert to human readable format
    const ethPrice = fromWeiString(exchangeRate, await snxjs.sETH.decimals())
    console.log("Current Price of sETH (in sUSD)", ethPrice)

    callback()
  } catch (error) {
    callback(error)
  }
}
