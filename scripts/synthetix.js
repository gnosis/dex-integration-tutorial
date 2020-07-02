const { SynthetixJs } = require("synthetix-js")
const fetch = require("node-fetch")
const { getBatchExchange, toWei, fromWei } = require("./util")

const MIN_SELL_USD = 10

const tokenDetails = async function (snxInstance, batchExchange, tokenName) {
  const address = web3.utils.toChecksumAddress(
    snxInstance[tokenName].contract.address
  )
  const [key, tokenId, decimals] = await Promise.all([
    snxInstance[tokenName].currencyKey(),
    batchExchange.tokenAddressToIdMap.call(address),
    snxInstance[tokenName].decimals(),
  ])

  return {
    name: tokenName,
    key: key,
    exchangeId: tokenId.toNumber(),
    address: address,
    decimals: decimals,
  }
}

const gasStationURL = {
  1: "https://safe-relay.gnosis.io/api/v1/gas-station/",
  4: "https://safe-relay.rinkeby.gnosis.io/api/v1/gas-station/",
}

const estimationURLPrexix = {
  1: "https://dex-price-estimator.gnosis.io//api/v1/",
  4: "https://dex-price-estimator.rinkeby.gnosis.io//api/v1/",
}

const estimatePrice = async function (
  buyTokenId,
  sellTokenId,
  sellAmount,
  networkId
) {
  const searchCriteria = `markets/${buyTokenId}-${sellTokenId}/estimated-buy-amount/${sellAmount}?atoms=true`
  const estimationData = await (
    await fetch(estimationURLPrexix[networkId] + searchCriteria)
  ).json()

  return estimationData.buyAmountInBase / estimationData.sellAmountInQuote
}

module.exports = async (callback) => {
  try {
    const networkId = await web3.eth.net.getId()
    const account = (await web3.eth.getAccounts())[0]
    console.log("Using account", account)
    const snxjs = new SynthetixJs({ networkId: networkId })
    const batchExchange = await getBatchExchange(web3)

    // Fetch relevant token details.
    const [sETH, sUSD] = await Promise.all([
      tokenDetails(snxjs, batchExchange, "sETH"),
      tokenDetails(snxjs, batchExchange, "sUSD"),
    ])

    // Compute Rates and Fees based on price of sETH.
    // Note that sUSD always has a price of 1 within synthetix protocol.
    const exchangeRate = await snxjs.ExchangeRates.rateForCurrency(sETH.key)
    const formatedRate = snxjs.utils.formatEther(exchangeRate)
    console.log("Oracle sETH Price (in sUSD)", formatedRate)

    const minSellsUSD = toWei(MIN_SELL_USD, sUSD.decimals)
    const theirSellPriceInverted = await estimatePrice(
      sETH.exchangeId,
      sUSD.exchangeId,
      minSellsUSD,
      networkId
    )
    const theirSellPrice = 1 / theirSellPriceInverted
    console.log("Gnosis Protocol sell sETH price (in sUSD)", theirSellPrice)

    const minSellsETH = toWei(MIN_SELL_USD / formatedRate, sETH.decimals)
    const theirBuyPrice = await estimatePrice(
      sUSD.exchangeId,
      sETH.exchangeId,
      minSellsETH,
      networkId
    )
    console.log("Gnosis Protocol buy  sETH price (in sUSD)", theirBuyPrice)

    // Using synthetix's fees, and formatting their return values with their tools.
    const sETHTosUSDFee = parseFloat(
      snxjs.utils.formatEther(
        await snxjs.Exchanger.feeRateForExchange(sETH.key, sUSD.key)
      )
    )
    const sUSDTosETHFee = parseFloat(
      snxjs.utils.formatEther(
        await snxjs.Exchanger.feeRateForExchange(sUSD.key, sETH.key)
      )
    )

    // Initialize order array.
    const orders = []

    // Compute buy-sell amounts based on unlimited orders with rates from above when the price is right.
    const ourBuyPrice = formatedRate * (1 - sUSDTosETHFee)
    if (ourBuyPrice > theirSellPrice) {
      // We are willing to pay more than the exchange is selling for.
      console.log(
        `Placing an order to buy sETH at ${ourBuyPrice}, but verifying sUSD balance first`
      )
      const sUSDBalance = await exchange.getBalance(account, sUSD.address)
      if (sUSDBalance.gte(minSellsUSD)) {
        const {
          base: sellSUSDAmount,
          quote: buyETHAmount,
        } = getUnlimitedOrderAmounts(
          1 / ourBuyPrice,
          sETH.decimals,
          sUSD.decimals
        )
        orders.push({
          buyToken: sETH.exchangeId,
          sellToken: sUSD.exchangeId,
          buyAmount: buyETHAmount,
          sellAmount: sellSUSDAmount,
        })
      } else {
        console.log(
          `Warning: Insufficient sUSD (${sUSDBalance.toString()} < ${minSellsUSD.toString()}) for order placement.`
        )
      }
    } else {
      console.log(
        `Not placing buy  sETH order, our rate of ${ourBuyPrice} is too low  for exchange.`
      )
    }

    const ourSellPrice = formatedRate * (1 + sETHTosUSDFee)
    if (ourSellPrice < theirBuyPrice) {
      // We are selling at a price less than the exchange is buying for.
      console.log(
        `Placing an order to sell sETH at ${ourSellPrice}, but verifying sETH balance first`
      )
      const sETHBalance = await exchange.getBalance(account, sETH.address)
      if (sETHBalance.gte(minSellsETH)) {
        const {
          base: sellETHAmount,
          quote: buySUSDAmount,
        } = getUnlimitedOrderAmounts(ourSellPrice, sUSD.decimals, sETH.decimals)
        orders.push({
          buyToken: sUSD.exchangeId,
          sellToken: sETH.exchangeId,
          buyAmount: buySUSDAmount,
          sellAmount: sellETHAmount,
        })
      } else {
        console.log(
          `Warning: Insufficient sETH (${sETHBalance.toString()} < ${minSellsETH.toString()}) for order placement.`
        )
      }
    } else {
      console.log(
        `Not placing sell sETH order, our rate of ${ourSellPrice} is too high for exchange.`
      )
    }

    if (orders.length > 0) {
      // Fetch auction index and declare validity interval for orders.
      // Note that order validity interval is inclusive on both sides.
      const batchId = (await exchange.getCurrentBatchId.call()).toNumber()
      const validFroms = Array(orders.length).fill(batchId)
      const validTos = Array(orders.length).fill(batchId)

      // Query Gnosis Gas Station
      const gasPrices = await (await fetch(gasStationURL[networkId])).json()
      console.log(`Using "fast" gas price "${fromWei(gasPrices.fast, 6)} GWei`)
      await exchange.placeValidFromOrders(
        orders.map((order) => order.buyToken),
        orders.map((order) => order.sellToken),
        validFroms,
        validTos,
        orders.map((order) => order.buyAmount),
        orders.map((order) => order.sellAmount),
        {
          from: account,
          gasPrice: gasPrices.fast,
        }
      )
    }
    callback()
  } catch (error) {
    callback(error)
  }
}
