const { getBatchExchange, toWei } = require("../util")
const { fetchTokenInfoFromExchange } = require("@gnosis.pm/dex-contracts")

const exchangeAccountTokenAmount = async function (
  web3,
  artifacts,
  tokenId,
  amount
) {
  const ERC20 = artifacts.require("ERC20Detailed")
  const exchange = await getBatchExchange(web3)
  console.log("Acquired Exchange", exchange.address)
  const account = (await web3.eth.getAccounts())[0]
  console.log("Using Account    ", account)

  const tokenInfo = (
    await fetchTokenInfoFromExchange(exchange, [tokenId], artifacts)
  ).get(tokenId)
  console.log("Token Details\n", tokenInfo)
  if (!(await exchange.hasToken(tokenInfo.address))) {
    callback(`Error: No token registered at index ${tokenId}`)
  }

  tokenInfo.instance = await ERC20.at(tokenInfo.address)
  const weiAmount = toWei(amount, tokenInfo.decimals)

  return [exchange, account, tokenInfo, weiAmount]
}

module.exports = {
  exchangeAccountTokenAmount,
}
