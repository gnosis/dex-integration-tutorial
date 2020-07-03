const { exchangeAccountTokenAmount } = require("./preamble")

const argv = require("yargs")
  .option("tokenId", {
    describe: "Token to withdraw",
    demandOption: true,
  })
  .option("amount", {
    describe: "Amount in to withdraw (in 10**18 WEI, e.g. 1 = 1 ETH)",
    demandOption: true,
  })
  .help(false)
  .version(false).argv

module.exports = async (callback) => {
  try {
    const [exchange, account, token, amount] = await exchangeAccountTokenAmount(
      web3,
      artifacts,
      argv.tokenId,
      argv.amount
    )

    await exchange.requestWithdraw(token.address, amount, { from: account })
    const claimableAt = (
      await exchange.getPendingWithdraw(account, token.address)
    )[1]
    console.log(`Request successful and claimable in batch ${claimableAt}`)
    callback()
  } catch (error) {
    callback(error)
  }
}
