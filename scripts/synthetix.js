const { SynthetixJs } = require("synthetix-js")
const ethers = require("ethers")
const { getBatchExchange } = require("./util")

const tokenDetails = async function (snxInstance, batchExchange, tokenName) {
  const key = await snxInstance[tokenName].currencyKey()
  const address = snxInstance[tokenName].contract.address
  const tokenId = await batchExchange.tokenAddressToIdMap.call(address)
  const decimals = await snxInstance[tokenName].decimals()

  return {
    name: tokenName,
    key: key,
    exchangeId: tokenId.toNumber(),
    address: address,
    decimals: decimals,
  }
}

module.exports = async (callback) => {
  try {
    const networkId = await web3.eth.net.getId()
    const account = (await web3.eth.getAccounts())[0]
    console.log("Using account", account)

    const snxjs = new SynthetixJs({ networkId: networkId })
    const batchExchange = await getBatchExchange(web3)

    const sETH = await tokenDetails(snxjs, batchExchange, "sETH")
    console.log(sETH)
    // // Compute Rates and Fees based on price of sETH.
    // // Note that sUSD always has a price of 1 within synthetix protocol.
    // const exchangeRate = await snxjs.ExchangeRates.rateForCurrency(sETHKey)
    // const formatedRate = snxjs.utils.formatEther(exchangeRate)
    // console.log("sETH Price", snxjs.utils.formatEther(exchangeRate))

    // // Using synthetix's fees, and formatting their return values with their tools, plus parseFloat.
    // const sETHTosUSDFee = parseFloat(
    //   snxjs.utils.formatEther(
    //     await snxjs.Exchanger.feeRateForExchange(sETHKey, sUSDKey)
    //   )
    // )
    // const sUSDTosETHFee = parseFloat(
    //   snxjs.utils.formatEther(
    //     await snxjs.Exchanger.feeRateForExchange(sUSDKey, sETHKey)
    //   )
    // )

    // // Compute buy-sell amounts based on unlimited orders with rates from above.
    // const [buyETHAmount, sellSUSDAmount] = getUnlimitedOrderAmounts(
    //   formatedRate * (1 - sUSDTosETHFee),
    //   sETH.decimals,
    //   sUSD.decimals
    // )
    // const [sellETHAmount, buySUSDAmount] = getUnlimitedOrderAmounts(
    //   formatedRate * (1 + sETHTosUSDFee),
    //   sUSD.decimals,
    //   sETH.decimals
    // )

    // const buyAmounts = [buyETHAmount, buySUSDAmount]
    // const sellAmounts = [sellSUSDAmount, sellETHAmount]

    // // Fetch auction index and declare validity interval for orders.
    // // Note that order validity interval is inclusive on both sides.
    // const batchId = (await batchExchange.getCurrentBatchId.call()).toNumber()
    // const validFroms = Array(2).fill(batchId)
    // const validTos = Array(2).fill(batchId)

    // // Avoid querying exchange by tokenAddress for fixed tokenId
    // const buyTokens = [sETH, sUSD].map((token) => token.exchangeId)
    // const sellTokens = [sUSD, sETH].map((token) => token.exchangeId)

    // await batchExchange.placeValidFromOrders(
    //   buyTokens,
    //   sellTokens,
    //   validFroms,
    //   validTos,
    //   buyAmounts,
    //   sellAmounts,
    //   {
    //     from: account,
    //   }
    // )
    callback()
  } catch (error) {
    callback(error)
  }
}
