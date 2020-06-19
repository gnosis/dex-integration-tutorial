const { BigNumber } = require("bignumber.js")
const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)

const { SynthetixJs } = require("synthetix-js")

const getBatchExchange = function (web3) {
  BatchExchange.setProvider(web3.currentProvider)
  return BatchExchange.deployed()
}

const getSynthetixExchange = async function (web3) {
  const networkId = await web3.eth.net.getId()
  return new SynthetixJs({ networkId: networkId })
}

// WARNING: This is a quick hack to convert to and from base units for ERC20 Tokens.
const toWei = function (value, decimals) {
  let baseUnit = new BigNumber(`10`).pow(decimals)
  return new BigNumber(value) * baseUnit
}

const fromWei = function (value, decimals) {
  let baseUnit = new BigNumber(`10`).pow(decimals)
  return new BigNumber(value) / baseUnit
}

module.exports = {
  getSynthetixExchange,
  getBatchExchange,
  toWei,
  fromWei,
}
