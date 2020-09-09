const truffleConfig = require("@gnosis.pm/util-contracts/src/util/truffleConfig")

const DEFAULT_GAS_LIMIT = 6e6
const DEFAULT_GAS_PRICE_GWEI = 5
const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"

const privateKey = process.env.PK
let mnemonic = process.env.MNEMONIC
if (!privateKey && !mnemonic) {
  mnemonic = DEFAULT_MNEMONIC
}

const gasPriceGWei = process.env.GAS_PRICE_GWEI || DEFAULT_GAS_PRICE_GWEI
const gas = process.env.GAS_LIMIT || DEFAULT_GAS_LIMIT

const infuraKey = process.env.INFURA_KEY || "9408f47dedf04716a03ef994182cf150"

const urlDevelopment = process.env.GANACHE_HOST || "localhost"
// Allow to add an additional network (useful for docker-compose setups)
//  i.e. ADDITIONAL_NETWORK='{ "name": "docker", "networkId": "99999", "url": "http://rpc:8545", "gas": "6700000", "gasPrice": "25000000000"  }'
let additionalNetwork = process.env.ADDITIONAL_NETWORK
  ? JSON.parse(process.env.ADDITIONAL_NETWORK)
  : null
// Solc
let solcUseDocker = process.env.SOLC_USE_DOCKER === "true" || false
let solcVersion = "0.5.7"

module.exports = {
  ...truffleConfig({
    mnemonic,
    privateKey,
    urlRinkeby: "https://rinkeby.infura.io/v3/".concat(infuraKey),
    urlKovan: "https://kovan.infura.io/v3/".concat(infuraKey),
    urlMainnet: "https://mainnet.infura.io/v3/".concat(infuraKey),
    urlDevelopment,
    gasPriceGWei,
    gas,
    additionalNetwork,
    optimizedEnabled: true,
    solcUseDocker,
    solcVersion,
  }),
}
