const { exchangeAccountTokenAmount } = require("./preamble")
const { fromWei } = require("../util")
const argv = require("yargs")
  .option("tokenId", {
    describe: "Token to claim",
    demandOption: true,
  })
  .help(false)
  .version(false).argv

module.exports = async (callback) => {
  try {
    const [exchange, account, token] = await exchangeAccountTokenAmount(
      web3,
      artifacts,
      argv.tokenId,
      0
    )

    const oldBalance = await token.instance.balanceOf(account)
    await exchange.withdraw(account, token.address, { from: account })
    const newBalance = await token.instance.balanceOf(account)

    const claimedAmount = fromWei(newBalance.sub(oldBalance), token.decimals)
    console.log(`Success claimed! ${claimedAmount} ${token.symbol}`)
    callback()
  } catch (error) {
    callback(error)
  }
}
