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

This should put us in the same place as has having completed the project initialization steps independantly. We are now prepared to start scripting interactions with the Gnosis Protocol. To test this run the `exchange_interaction` script via

```sh
truffle exec scripts/exchange_interaction.js --network rinkeby
```

Which simply aquires the BatchExchange contract deployed at the appropriate address and prints the current Batch Index.

The most important lines used in this script are the following few import statements for acquiring the Batch Exchange contract artifacts and setting the network provider.

```js
const Contract = require("@truffle/contract")
const BatchExchange = Contract(
  require("@gnosis.pm/dex-contracts/build/contracts/BatchExchange")
)
BatchExchange.setProvider(web3.currentProvider)
```

These lines are seen at the top of our [exchange_interaction.js](exchange_interaction.js) script that we will use for testing.

To run this script, from within the project directory, execute

```sh
truffle exec scripts/exchange_interaction.js --network rinkeby
```

and observe the following logs:

```
Using network 'rinkeby'.

Aquired Batch Exchange 0xC576eA7bd102F7E476368a5E98FA455d1Ea34dE2
Current Batch 5308007
```

This means we have actually acquired batch Id from the samrt contract directly and we are ready to start making some more involved interactions!

## [Optional] Testing Locally (i.e. in Ganache)

To continue in this direction please checkout the `local_dev` branch of the tutorial repo.

```sh
git checkout local_dev
```
