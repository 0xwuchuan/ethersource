# Ethersource

> Turns out there is a better tool (cast from foundry) already but this is just here as a reminder that at least i tried something 💀

## About

Ethersource is a simple tool to download the source code of verified smart contracts on etherscan. The files are organised in their respective paths and allows for a better experience of browsing smart contracts from etherscan

> **Note:**
> Ethersource is still a work in progress but it is currently able to download verified smart contracts that are in multiple files as of 27/6/2022

## Motivation

I developed this out of frustration of trying to read smart contracts on etherscan. The experience of trying to inspect and take reference from existing smart contracts was a painful experience for me.

I would much rather be able to read the smart contracts on VScode with syntax highlighting and a great search functionality

## How

The contract source code is simply fetched from [etherscan's api](https://docs.etherscan.io/api-endpoints/contracts). The source code is then parsed and placed into their respective paths.

This small project was heavily inspired by [DethCode](https://github.com/dethcrypto/dethcode) and [ETHover](https://github.com/ConsenSys/vscode-ethover). I adapted their implementation to fix my use case. Check them out!

## Usage

1. Run `npm install` to install the dependencies needed for this tool

2. Run `npm run ethersource <contract_address>` to download the verified source code from etherscan

3. Your downloaded files will be in the build folder
