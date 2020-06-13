# Dex Integration Tutorial

A lightweight repo demonstrating and guiding on how to minimally integrate with the Gnosis Protocol exchange platform.

## Requirements

- Truffle

## Project Initialization and Network Configuration

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

## First Interactions with Batch Exchange
