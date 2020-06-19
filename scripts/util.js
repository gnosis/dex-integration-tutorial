const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)

const getBatchExchange = function (web3) {
  BatchExchange.setProvider(web3.currentProvider)
  return BatchExchange.deployed()
}

module.exports = {
  getBatchExchange,
}
