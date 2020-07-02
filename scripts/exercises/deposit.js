const { getBatchExchange, toWei } = require("../util")
const { fetchTokenInfoFromExchange } = require("@gnosis.pm/dex-contracts")
const ERC20 = artifacts.require("ERC20Detailed")

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
    const exchange = await getBatchExchange(web3)
    console.log("Acquired Exchange", exchange.address)

    const depositor = (await web3.eth.getAccounts())[0]
    console.log(`Using account ${depositor}`)
    const tokenInfo = (
      await fetchTokenInfoFromExchange(exchange, [argv.tokenId], artifacts)
    ).get(argv.tokenId)
    console.log("Deposit Token", tokenInfo)

    const token = await ERC20.at(tokenInfo.address)
    const amount = toWei(argv.amount, tokenInfo.decimals)

    const balance = await token.balanceOf(depositor)
    if (balance.lt(amount)) {
      callback(
        `Error: Insufficient funds - ${balance.toString()} < ${amount.toString()}`
      )
    }

    const allowance = await token.allowance(depositor, exchange.address)
    if (allowance.lt(amount)) {
      console.log(`Approving Exchange for amount ${amount.toString()}`)
      await token.approve(exchange.address, amount, {
        from: depositor,
      })
    }

    console.log(`Depositing ${argv.amount} ${tokenInfo.symbol} in Exchange`)
    await exchange.deposit(token.address, amount, { from: depositor })
    const tradeable_at = (
      await exchange.getPendingDeposit(depositor, token.address)
    )[1]
    console.log(`Deposit successful! Can be traded as of batch ${tradeable_at}`)
    callback()
  } catch (error) {
    callback(error)
  }
}
