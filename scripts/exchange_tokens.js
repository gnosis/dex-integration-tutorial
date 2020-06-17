const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)
BatchExchange.setProvider(web3.currentProvider)

const { fetchTokenInfoFromExchange } = require("@gnosis.pm/dex-contracts")

const argv = require("yargs")
  .option("tokenIds", {
    type: "string",
    describe: "Token Ids whose info should be fetched.",
    demandOption: true,
    coerce: (str) => {
      return str.split(",").map((o) => parseInt(o))
    },
  })
  .help(false)
  .version(false).argv

module.exports = async (callback) => {
  try {
    const exchange = await BatchExchange.deployed()

    const numTokens = await exchange.numTokens.call()
    console.log(`Exchange has ${numTokens} registered tokens`)

    const tokenInfo = await fetchTokenInfoFromExchange(
      exchange,
      argv.tokenIds,
      artifacts
    )

    console.log(tokenInfo)

    callback()
  } catch (error) {
    callback(error)
  }
}
