// Batch Exchange related imports
const Contract = require("@truffle/contract")
const BatchExchange = Contract(require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange"))
BatchExchange.setProvider(web3.currentProvider)

// Synthetix related imports
const { SynthetixJs } = require("synthetix-js")
// This is used for 
const ethers = require("ethers")

contract("Integration Example", function(accounts) {

  describe("Fetch Batch Exchange", async function() {
    it("Can access exchange public values", async () => {
      const exchange = await BatchExchange.deployed()

      const batchId = (await exchange.getCurrentBatchId()).toNumber()
      const ts = Math.round((new Date()).getTime() / 1000)
      assert.equal(batchId, Math.floor(ts / 300))
    })
  })
  describe("Fetch Synthetix (Rinkeby)", async function() {
    it("Acquires total supply of sUSD", async () => {
      // Note that we do not have access to a dev network version of the snxjs object.
      const snxjs = new SynthetixJs({ networkId: 4 })
      const totalSUSD = await snxjs.sUSD.totalSupply()

      const totalSUSDSupply = snxjs.utils.formatEther(totalSUSD)
      // console.log("sUSDTotalSupply", totalSUSDSupply)
      assert(typeof(totalSUSDSupply, Number), "Fake assertion")
    })
    it("Acquires address and price of sETH (Rinkeby)", async () => {
      // Note that we do not have access to a dev version of the snxjs object.
      const snxjs = new SynthetixJs({ networkId: 4 })

      const sETHKey = await snxjs.sETH.currencyKey()
      const sETHAddress = await snxjs.Synthetix.synths(sETHKey)

      const exchangeRate = await snxjs.ExchangeRates.rateForCurrency(sETHKey)

      // console.log("sETH token Address", sETHAddress)
      // console.log("sETH Current Exchange Rate", snxjs.utils.formatEther(exchangeRate))

      assert(typeof(sETHAddress, String), "Fake assertion")
      assert(typeof(exchangeRate, Number), "Fake assertion")
    })
  })
})
