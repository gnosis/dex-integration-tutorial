const { getBatchExchange } = require("./util")
const { fetchTokenInfoFromExchange } = require("@gnosis.pm/dex-contracts")

const argv = require("yargs")
  .option("tokenIds", {
    type: "string",
    describe: "Token Ids whose info should be fetched.",
    coerce: (str) => {
      return str.split(",").map((o) => parseInt(o))
    },
  })
  .help(false)
  .version(false).argv

module.exports = async (callback) => {
  try {
    const exchange = await getBatchExchange(web3)

    const numTokens = (await exchange.numTokens.call()).toNumber()
    console.log(`Exchange has ${numTokens} registered tokens`)

    // Use the token list provided or use range(0, numTokens) to fetch all
    // TODO - upgrade dex-contracts node module with improved token fetching.
    const tokens =
      argv.tokenIds ||
      Array(numTokens)
        .fill(0)
        .map((_, i) => i)
    const tokenInfo = await fetchTokenInfoFromExchange(
      exchange,
      tokens,
      artifacts
    )

    console.log(tokenInfo)

    callback()
  } catch (error) {
    callback(error)
  }
}
