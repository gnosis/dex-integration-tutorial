# Dex Integration Tutorial

A lightweight repo demonstrating and guiding on how to minimally integrate with the Gnosis Protocol exchange platform.

- [Requirements](#requirements)
- [[Optional] Project Initialization and Network Configuration](#Project-Initialization-and-Network-Configuration)
- [Interaction with Batch Exchange](#interaction-with-batch-exchange)
  - [Fetch Token Info](#Fetch-Token-Info)
  - [Deposit and Place Orders](#Deposit-and-Place-Orders)
- [Synthetix Liquidity Bot](#synthetix-liquidity-bot)
  - [Getting Started](#Getting-Started)
  - [Write the Script](#Write-the-Script)
  - [Build a Docker Image](#build-a-docker-image)
  - [Running the Bot](#running-the-bot)
- [Uniswap Integration](#uniswap-integration)
- [[Optional] Testing Locally](#Testing-Locally)

## Requirements

- [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) or alternatively you could use the node package manager `npm` included with Node.

## Project Initialization and Network Configuration

This section is intended to be a first step when building a new project from scratch. If you would prefer to start from a preconfigured environment, feel free to skip ahead to the next section.

```sh
mkdir <project_title>
cd project_title
truffle init
yarn add @gnosis.pm/dex-contracts
[optional] yarn add @gnosis.pm/util-contracts
[optional] yarn add @openzeppelin/contracts@2.5.1
```

With `dex-contracts` npm package installed, you will need to copy the BatchExchange artifact into your local build folder.

This can be done with the following command

```sh
cp ./node_modules/@gnosis.pm/dex-contracts/build/contracts/BatchExchange.json ./build/contracts
```

For convienince, we have included this in the script portion of [package.json](./package.json) as the yarn command `copy-artifacts` along with a couple of other helpfull scripts (`build` and `compile`) if you plan to write any smart contracts as part of your integration.
With these commands, you can initialize this project (at any time) by running `yarn build`.

Make sure that you have a valid (truffle configuration)[https://www.trufflesuite.com/docs/truffle/reference/configuration] for the network you intend on interacting with.
We will be using the common `truffle-config.js` found in most, if not all, gnosis smart contract projects.
In order to use the common gnosis truffle configuration, you will need to install the optional package `@gnosis.pm/util-contracts` listed above.
Furthermore, you will have to provide your own `INFURA_KEY`.

Note that, if you plan to be experimenting with a locally hosted development network, you will need to install additional "devDepencencies" to mirgrate the `BatchExchange` Smart Contracts. This will be covered in detail once we have successfully confirmed our ability to interact with the existing mainnet smart contracts.

## Interaction with Batch Exchange

Assuming you were successful with optionally configuring your own project from the section above, we will continue here from a pre-configured environment obtained and installed as follows:

```sh
git clone git@github.com:bh2smith/dex-integration-tutorial.git
cd dex-integration-tutorial
yarn install
yarn build
```

This should put us in the same place as has having completed the project initialization steps independantly.
We are now prepared to start scripting interactions with the Gnosis Protocol.
To test this run the `exchange_interaction` script via the command below.

Note that before attempting to execute any of these truffle scripts, you will have to export your own `INFURA_KEY`!

```sh
export INFURA_KEY=<your infura key>
```

```sh
npx truffle exec scripts/exchange_interaction.js --network rinkeby
```

and observe the following logs:

```
Using network 'rinkeby'.

Aquired Batch Exchange 0xC576eA7bd102F7E476368a5E98FA455d1Ea34dE2
Current Batch XXXXXXX
```

This script simply aquires the BatchExchange contract deployed at the appropriate network and prints the current batch index.

A few important lines used throughout such integration are are the following import statements used for acquiring the Batch Exchange contract artifacts according to the correct network.

Now that we have successfully acquired the BatchExchange contract artifact, we are ready to start making some more involved interactions!

### Fetch Token Info

As a second simple interaction with the exchange, we can fetch token information for those registered. This script requires a few additional dev-tweaks in order to have access to `ECR20Detailed` token contract artifacts.

We will need to install `@openzeppelin/contracts@2.5.1` and import `ERC20Detailed` so that is it included in truffle migrations. To do this from scratch

```sh
yarn add @openzeppelin/contracts@2.5.1
```

and create a new file [contracts/Dependencies.sol](contracts/Dependencies.sol) importing `ERC20Detailed` contract artifact. Then run the following script.

```sh
npx truffle exec scripts/exchange_tokens.js --tokenIds 1,2 --network rinkeby
```

This example also demonstrates how we can use `kwargs` to easily pass and parse arguments into our script.

### Deposit, Withdraw and Place Orders

At this point, we should be easily able to use our existing toolset to script an order placement on `BatchExchange`.

Use the hollow script to write the deposit functionality:

```sh
cp scripts/hollow_script.js scripts/deposit.js
```

## Synthetix Liquidity Bot

In order to demonstrate an integration between two exchanges, we will make an example out of the Synthetix Protocol using their NPM package [synthetix-js](https://www.npmjs.com/package/synthetix-js) whose docs are avaialble [here](https://docs.synthetix.io/libraries/synthetix-js/)

### Getting Started

To get started, we construct a simple interaction with their protocol in which we fetch the price `sETH` from their onchain price oracle (chainlink). This interaction is contained within [scripts/synthetix_interaction.js](scripts/synthetix_interaction.js)

To test our tiny interaction run

```sh
npx truffle exec scripts/synthetix_interaction.js --network rinkeby
```

### Write the Script

Now we are ready to build our liquidity provision bot that mirriors exchange rates from synthetix platform (including fees) and places orders in Gnosis Protocol whenever the price estimation services suggests there might be an overlaping order.

For this we have written the script [scripts/synthetix.js](scripts/synthetix.js) which essentaially performs the following sequence of operations:

- Instantiate a synthetix and batchExchange for the desired network
- Fetch relevant token infomation for `sUSD` and `sETH`
- Fetch the exchange rate `sUSD`<->`sETH` from their on chain oracle along with the network fees for trading these tokens
- Compare the buy and sell `sETH` for `sUSD` prices with thier counter parts on Gnosis Protocol
- If the price comparisons suggest there is likely trade on and the "bot" has sufficient balance, place order(s) on BatchExchange valid for a single batch.

All of these facts are documented in the script's logs. To test this, run

```sh
npx truffle exec scripts/synthetix.js --network rinkeby
```

Given that there is often no orders between these tokens on rinkeby, you should see the following logs:

```
Using network 'rinkeby'.

Using account 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
Oracle sETH Price (in sUSD) 222.04638321287640657
Gnosis Protocol sell sETH price (in sUSD) Infinity
Gnosis Protocol buy  sETH price (in sUSD) 0
Not placing buy  sETH order, our rate of 221.38024406323777 is too low  for exchange.
Not placing sell sETH order, our rate of 222.15740640448283 is too high for exchange.
```

Now that we have this bot-script ready for production it remains run this automatically in every batch.
For this we will publish this project as a docker image and run the script every five minutes as a cronjob on kubernetes.

### Build a Docker Image

The docker file is a very simple basic instance of this project having a bash entry point. [Dockerfile](Dockerfile).
To build the image, from within the project root

```sh
docker build -t <YOUR_DOCKERHUB_HANDLE>/synthetix-bot .
docker run -e INFURA_KEY=$YOUR_INFURA_KEY -e PK=$YOUR_PRIVATE_KEY -t <YOUR_DOCKERHUB_HANDLE>/synthetix-bot:latest "truffle exec scripts/synthetix.js --network rinkeby"
```

To avoid including `INFURA_KEY` on every execution, this value can be included/replaced line 16 of [truffle-config.js](truffle-config.js) before building the docker image.
However, it is important to note that these keys should not be pushed into a public repo.

### Running the Bot

At this point, you are now ready to deploy your liquidity bot. This is easily done by running our script in a crontab every five minutes at, say, the 3 minute mark of each batch.
Although we will not provide any instructions for deployment here, there is a sample [crontab.txt](contab.txt) and slightly altered [Dockerfile](Dockerfile.Cron) that can be used to run the job inside a container.

Alternatively, see the kubernetes directory here for a mock deployment configuration.

## Uniswap Integration

TODO - gain access to uniswap price feed and place orders on GP when arbitrage exists.

## Testing Locally

To continue in this direction please checkout the `local_dev` branch of the tutorial repo.

```sh
git checkout local_dev
```
