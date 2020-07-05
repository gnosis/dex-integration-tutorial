const { BigNumber } = require("bignumber.js")
const BN = require("bn.js")
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
// BigNumber used because it accepts float, and BN because it is preferred by truffle.
const toWei = function (value, decimals) {
  let baseUnit = new BigNumber(`10`).pow(decimals)
  const res = new BigNumber(value) * baseUnit
  return new BN(res.toString())
}

const fromWei = function (value, decimals) {
  let baseUnit = new BigNumber(`10`).pow(decimals)
  const res = new BigNumber(value) / baseUnit
  return new BN(res.toString())
}

module.exports = {
  getSynthetixExchange,
  getBatchExchange,
  toWei,
  fromWei,
}
