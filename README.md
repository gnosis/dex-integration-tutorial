# Dex Integration Tutorial

A lightweight repo demonstrating and guiding on how to minimally integrate with the Gnosis Protocol exchange platform.

## Requirements

- [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) or alternatily you could use the node package manager `npm` included with Node.

## [Optional] Project Initialization and Network Configuration

This section is intended to be a first step when building a new project from scratch. If you would prefer to start from a preconfigured environment, feel free to skip ahead to the next section.

```sh
mkdir <project_title>
cd project_title
truffle init
yarn add @truffle/contract
yarn add @gnosis.pm/dex-contracts
[optional] yarn add @gnosis.pm/util-contracts
```

Make sure that you have a valid (truffle configuration)[https://www.trufflesuite.com/docs/truffle/reference/configuration] for the network you intend on interacting with.
We will be using the common `truffle-config.js` found in most, if not all, gnosis smart contract projects.
In order to use the common gnosis truffle configuration, you will need to install the optional package `@gnosis.pm/util-contracts` listed above.
Furthermore, you will likely have to provide your own `INFURA_KEY`

Note that, if you plan to be experimenting with a locally hosted development network, you will need to install additional "devDepencencies" to mirgrate the `BatchExchange` Smart Contracts. This will be covered in detail once we have successfully confirmed our ability to interact with the existing mainnet smart contracts.

## First Interaction with Batch Exchange

Assuming you were successful with optionally configuring your own project from the section above, we will continue here from a pre-configured environment obtained and installed as follows:

```sh
git clone git@github.com:bh2smith/dex-integration-tutorial.git
yarn install
```

This should put us in the same place as has having completed the project initialization steps independantly.
We are now prepared to start scripting interactions with the Gnosis Protocol.
To test this run the `exchange_interaction` script via

```sh
truffle exec scripts/exchange_interaction.js --network rinkeby
```

and observe the following logs:

```
Using network 'rinkeby'.

Aquired Batch Exchange 0xC576eA7bd102F7E476368a5E98FA455d1Ea34dE2
Current Batch 5308007
```

This script simply aquires the BatchExchange contract deployed at the appropriate network and prints the current batch index.

A few important lines used throughout such integration are are the following import statements used for acquiring the Batch Exchange contract artifacts according to the correct network.

```js
const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)
BatchExchange.setProvider(web3.currentProvider)
```

These imports have been made more accessible in the form of a function `getBatchExchange` in [scripts/util.js](scripts/util.js) and will be used from now on throughout this tutorial.

Now that we have successfully acquired the BatchExchange contract artifact, we are ready to start making some more involved interactions!

### Fetch Token Info

As a second simple interaction with the exchange, we can fetch token information for those registered. This script requires a few additional dev-tweaks in order to have access to `ECR20Detailed` token contract artifacts.

We will need to install `@openzeppelin/contracts@2.5.1` and import `ERC20Detailed` so that is it included in truffle migrations. To do this from scratch

```sh
yarn add @openzeppelin/contracts@2.5.1
```

and create a new file [contracts/Dependencies.sol](contracts/Dependencies.sol) importing `ERC20Detailed` contract artifact. Then run the following script.

```sh
truffle exec scripts/exchange_tokens.js --tokenIds 1,2 --network rinkeby
```

This example also demonstrates how we can use `kwargs` to easily pass and parse arguments into our script.

## Deposit and Place Orders on Batch Exchange

At this point, we should be easily able to use our existing toolset to script an order placement on `BatchExchange`.

TODO: write deposit and place_order scripts (will need to write amount formatter for ERC20 with special decimals).

## Synthetix Liquidity Bot

## [Optional] Testing Locally (i.e. in Ganache)

To continue in this direction please checkout the `local_dev` branch of the tutorial repo.

```sh
git checkout local_dev
```
