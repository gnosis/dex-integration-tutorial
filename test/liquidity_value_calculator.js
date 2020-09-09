const ValueCalculator = artifacts.require("LiquidityValueCalculator")

const Token = artifacts.require("DetailedMintableToken")
const Contract = require("@truffle/contract")
const UniswapV2Factory = Contract(
  require("@uniswap/v2-core/build/UniswapV2Factory")
)

const { truffleAssert } = require("truffle-assertions")

contract("LiquidityValueCalculator", function (accounts) {
  describe("computeLiquidityShareValue()", async function () {
    it("returns expected values", async () => {
      UniswapV2Factory.setProvider(web3.currentProvider)
      const Factory = await UniswapV2Factory.new(accounts[0], {
        from: accounts[0],
      })

      const etherToken = await Token.new("ETH", 18)
      await etherToken.mint(accounts[0], 10)

      const usdToken = await Token.new("USD", 18)
      await usdToken.mint(accounts[0], 2500)

      await Factory.createPair(etherToken.address, usdToken.address, {
        from: accounts[0],
      })

      console.log(await Factory.contract.methods.allPairsLength().call())

      const LiquidityValueCalculator = await ValueCalculator.new(
        Factory.address
      )
      console.log("Value calculator", LiquidityValueCalculator.address)
      assert(false)
    })
    // it("", async () => {
    // })
  })
})
