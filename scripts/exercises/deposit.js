const { exchangeAccountTokenAmount } = require("./preamble")

const argv = require("yargs")
  .option("tokenId", {
    describe: "Token to deposit",
    demandOption: true,
  })
  .option("amount", {
    describe: "Amount in to deposit (in 10**18 WEI, e.g. 1 = 1 ETH)",
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

    const balance = await token.instance.balanceOf(account)
    if (balance.lt(amount)) {
      callback(
        `Error: Insufficient funds - ${balance.toString()} < ${amount.toString()}`
      )
    }

    const allowance = await token.instance.allowance(account, exchange.address)
    if (allowance.lt(amount)) {
      console.log(`Approving Exchange for amount ${amount.toString()}`)
      await token.approve(exchange.address, amount, {
        from: depositor,
      })
    }

    console.log(`Depositing ${argv.amount} ${token.symbol} in Exchange`)
    await exchange.deposit(token.address, amount, { from: account })
    const tradableAt = (
      await exchange.getPendingDeposit(account, token.address)
    )[1]
    console.log(`Deposit successful and tradable as of batch ${tradableAt}`)
    callback()
  } catch (error) {
    callback(error)
  }
}
