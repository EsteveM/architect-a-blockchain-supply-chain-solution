# Architect a Blockchain Supply Chain Solution

This project is intended to create a DApp that implements a supply chain powered by Ethereum. Its main goal is to design and develop a number of smart contracts that enforce access control, and track the origin of products while verifying their authenticity.

## Table of Contents

* [Some key data](#some-key-data)
* [Description of the Project](#description-of-the-project)
* [Getting Started](#getting-started)
* [Contributing](#contributing)

## Some key data

In this section, some key data is provided, which can also be found on subsequent sections:

* Deployment on Rinkeby, contract address: https://rinkeby.etherscan.io/address/0x0aa5234ea0992000cb1836d4063993c775b26c63. 
* Deployment on Rinkeby, transaction ID: 0x1e527e482ec7f4da662263ceffd0bd6bbdd3a0ed2470ca5cf97c9c18143e0f25.
* Versions used for a number of tools: 
    * [Node](https://nodejs.org/es/) v10.15.3
    * [Truffle](https://www.trufflesuite.com/) v4.1.15 (core: 4.1.15)
    * [Solidity](https://solidity.readthedocs.io/en/v0.5.10/) v0.4.25 (solc-js)
    * [web3](https://web3js.readthedocs.io/en/1.0/) @1.0.0-beta.37
    * [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider) @1.0.13
    * [lite-server](https://github.com/johnpapa/lite-server) @2.4.0
    * [Ganache CLI](https://github.com/trufflesuite/ganache-cli) v6.4.3 (ganache-core: 2.5.5)
    * [Metamask](https://metamask.io/) Version 6.7.2

## Description of the Project

As has already been mentioned, this project develops a Dapp which implements a supply chain management system based on Ethereum. The objective is to design and code a solution based on blockchain to help tracking the origin and verifying the authenticity of products. Besides the creation of the corresponding smart contracts, a front-end is to be provided to the users of the system to manage products as they move on throughout the supply chain. The work that has been done is best described by explaining its main areas:

### Step 1  Planning of the project with write-ups

This is the first step of the project, and is made up of two different parts:

#### Step 1.1   Project write-up - UML

The first requirement of the first step of this project is the planning of the solution. With this aim in view, a number of UML documents have been generated:

* Activity diagram

![Activity diagram](/UML/png/UMLActivity.png)

* Sequence diagram

![Sequence diagram](/UML/png/UMLSequence.png)

* State diagram

![State diagram](/UML/png/UMLState.png)

* Classes diagram

![Classes diagram](/UML/png/UMLClass.png)


#### Step 1.2	Project write-up - Libraries

This project has made use of:

* [Node](https://nodejs.org/es/) v10.15.3
* [Truffle](https://www.trufflesuite.com/) v4.1.15 (core: 4.1.15)
* [Solidity](https://solidity.readthedocs.io/en/v0.5.10/) v0.4.25 (solc-js)
* [web3](https://web3js.readthedocs.io/en/1.0/) @1.0.0-beta.37
* [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider) @1.0.13
* [lite-server](https://github.com/johnpapa/lite-server) @2.4.0
* [Ganache CLI](https://github.com/trufflesuite/ganache-cli) v6.4.3 (ganache-core: 2.5.5)
* [Metamask](https://metamask.io/) Version 6.7.2

### Step 2	Writing the smart contracts

This is the second step of the project, and is made up of four different parts:

#### Step 2.1	Defining and implementing interfaces

The first requirement of the second step of this project focuses on the inheritance structure of the smart contracts. This has been established like this:

* The contracts FarmerRole, DistributorRole, RetailerRole, and ConsumerRole, import the library Roles. In this way, they can access functionality provided by (they inherit from) Roles.
* The contract SupplyChain inherits from FarmerRole, DistributorRole, RetailerRole, and ConsumerRole. That means that all functionality within the Role contracts can be used within (is inherited by) SupplyChain. 
* The contract SupplyChain inherits from Ownable. In other words, all functionality within the Ownable contract can be used within (is inherited by) SupplyChain.

#### Step 2.2   Building out AccessControl Contracts

In this requirement, the AccessControl contracts have been built out (FarmerRole.sol, DistributorRole.sol, RetailerRole.sol, and ConsumerRole.sol).

#### Step 2.3   Building out Base Contract

In this requirement, the Base Contract (SupplyChain.sol) is built out. It is noteworthy that the ownership management in this contract is not used, and the one in the Core Contract (ownable.sol) is used instead.

#### Step 2.4   Building out Core Contract

This requirement has already been provided in the starter code that this project intends to build on. As already mentioned, the ownership management used is the one in this contract.

### Step 3  Testing smart contract code coverage

The third step of the project builds out the tests for all functions in the sequence diagram. Note that before the tests are executed, the different actors are assigned their roles in the system. This is done only once before the entire group of tests, not once before each test.

The eleven tests covered are:

* Testing smart contract function harvestItem() that allows a farmer to harvest coffee.
* Testing smart contract function processItem() that allows a farmer to process coffee.
* Testing smart contract function packItem() that allows a farmer to pack coffee.
* Testing smart contract function sellItem() that allows a farmer to sell coffee.
* Testing smart contract function buyItem() that allows a distributor to buy coffee. 
* Testing smart contract function shipItem() that allows a distributor to ship coffee. 
* Testing smart contract function receiveItem() that allows a retailer to mark coffee received. 
* Testing smart contract function purchaseItem() that allows a consumer to purchase coffee.
* Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain.
* Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain.
* Testing smart contract function transferOwnership() that allows the owner of the contract to transferownership.

### Step 4	Deploying smart contracts on a public test network (Rinkeby)

This is the fourth step of the project, where the smart contract has been deployed to the Rinkeby public test network.

After successful deployment, the contract address hash is: 0x0aa5234ea0992000cb1836d4063993c775b26c63. It can be accessed at Etherscan at https://rinkeby.etherscan.io/address/0x0aa5234ea0992000cb1836d4063993c775b26c63. The transaction hash for contract creation is: 0x1e527e482ec7f4da662263ceffd0bd6bbdd3a0ed2470ca5cf97c9c18143e0f25.

### Step 5  Modifying client code to interact with smart contracts

In this last step of the project, a front-end is developed that makes it possible for the different actors of the system to manage product items from origin to end within the supply chain.

## Getting Started

The procedure to obtain functional a copy of the project on your local machine so that you can further develop and/or test it is explained in this section. It is assumed that you have already installed [Truffle](https://www.trufflesuite.com/), [Ganache CLI](https://github.com/trufflesuite/ganache-cli), and the [Metamask](https://metamask.io/) extension in your browser. These are the steps to be followed:

* Firstly, you have to download/clone the project files from this repository onto your local machine. Then, cd into the root folder where the project files are located.
* Secondly, type `npm install` on a terminal shell window so that all required npm packages are installed.
* Thirdly, you have to set up a *secret-parameters.js* file at the root folder of this project, where you are located just now. This is a secret parameters file where you will have to type your *Metamask seed (mnemonic)*, and your *Infura PROJECT ID (infuraKey)*. For convenience, one such file has been provided for you, so that you just have to fill out the data into the corresponding fields.
* In the fourth place, to run the supporting unit tests on Ganache, you have to:
    * Run Ganache by typing `ganache-cli`. This will start Ganache at *http://127.0.0.1:8545/*.
    * Open a new terminal shell window, cd to the same root folder of the project, and type `truffle compile` to compile the smart contracts. Once the contracts have been successfully compiled, type `truffle migrate --reset`, to deploy them to Ganache.
    * Now, you can run `truffle test` to run all eleven supporting unit tests.
    ![CompileMigrateTest](/Screenshots/CompileMigrateTest.png)
* In the fifth place, the following steps show you an easy way to make use of the front end of the Dapp:
    * Set the *http://127.0.0.1:8545/* address in Metamask so that the Ganache private network can be accessed. 
    * Import between one and five accounts from the list shown by *Ganache* into your Metamask. At least one account should be imported, the first one, which deployed the contract. This account has all four roles in the supply chain: farmer, distributor, retailer, and consumer. 
    * Once this has been done, open a new terminal shell window, cd to the same root folder of the project, and then type `npm run dev`. This last command starts the *lite-server* at *http://localhost:3000*. If that is not done automatically for you, open that address in your browser to access the front end of the Dapp.
    * The currently connected Metamask account address is shown in the first section of the front-end page (*Current Address Information*). Click now *Refresh* to view your most recent data within this section, or otherwise whenever you change your currently selected Metamask account address.
    ![CurrentAddressInfo](/Screenshots/CurrentAddressInfo.png)
    * Although you could manage the whole life cycle of the product throughout the supply chain with just the account address that deployed the contract, you can also assign/remove roles to/from other accounts. This way, you could use those accounts as actors as well. To this end, the next two sections of the front-end page (*Role Addition* and *Role Removal*) allow you to do just that.
    ![AddRemoveRoles](/Screenshots/AddRemoveRoles.png)
    * Once you have your Metamask account selected, you can manage the product throughout the different supply chain stages:
        * First of all, you must provide the system with the UPC of the product to be fetched, or otherwise introduced into the supply chain for the first time. This can be accomplished in the fourth section of the front-end page (*Product Overview*). Afterwards, click *Fetch Data*. Note that you do not have to provide SKU, current owner ID, and item state, as those are managed by the system without user intervention.
        In the image below, the UPC is entered:
        ![ProductOverviewInfo](/Screenshots/ProductOverviewInfo.png)
        Then, the *Fetch Data* button is clicked:
        ![ProductOverviewInfo2](/Screenshots/ProductOverviewInfo2.png)
        * *Harvested stage*: Once the product has been selected, the first supply chain stage can be attempted. Note that to mark a product as harvested you must be a farmer. In addition, you must provide the following data: UPC, farm name, information, latitude, and longitude, and product notes. The farmer ID is assumed to be the currently connected address. You will find example data to fill the form fields out in the form itself. Note that you do not have to provide the farmer ID, as it is managed by the system without user intervention. Once the corresponding fields have been filled out, just click *Harvest*.
        * *Processed stage*: Note that to mark a product as processed, the product must be in the harvested stage, and you must be the farmer who harvested it. In addition, you must provide the product's UPC. At this point, it is enough for you to just click *Process*.
        * *Packed stage*: Note that to mark a product as packed, the product must be in the processed stage, and you must be the farmer who processed it. In addition, you must provide the product's UPC. At this point, it is enough for you to just click *Pack*.
        * *For Sale stage*: Note that to mark a product as for sale, the product must be in the packed stage, and you must be the farmer who packed it. In addition, you must provide the product's UPC, and the price you want to sell the product for. Note that the price is to be provided in Gwei. One Gwei equals 1000000000 Wei, or 0.000000001 Ether. Gwei is otherwise known as Shannon, Nanoether, or Nano. For instance, a price of 6000000000 Gwei equals 6 Ether. At this point, and after introducing the desired price, it is enough for you to just click *ForSale*.
        ![FirstFourStages](/Screenshots/FirstFourStages.png)
        * *Sold (buy) stage*: Note that to mark a product as sold, you must be a distributor, the product must be in the for sale stage, and the paid amount must be sufficient to cover the price. In addition, you must provide the product's UPC. The distributor ID is assumed to be the currently connected address. At this point, it is enough for you to just click *Buy*.
        * *Shipped stage*: Note that to mark a product as shipped, the product must be in the sold stage, and you must be the distributor who bought it. In addition, you must provide the product's UPC. At this point, it is enough for you to just click *Ship*.
        * *Received stage*: Please, note that to mark a product as received, the product must be in the shipped stage, and you must be a retailer. In addition, you must provide the product's UPC. The retailer ID is assumed to be the currently connected address. At this point, it is enough for you to just click *Receive*.
        * *Purchased stage*: Please, note that to mark a product as purchased, the product must be in the received stage, and you must be a consumer. In addition, you must provide the product's UPC. The consumer ID is assumed to be the currently connected address. At this point, it is enough for you to just click *Purchase*.
        ![FinalFourStages](/Screenshots/FinalFourStages.png)
        * Here you can see an example transaction history where a product has been harvested, processed, packed, sold, bought, and shipped by the deployer of the contract. As you know, the deployer of the contract has all roles. To make things a little bit more interesting, after that, the deployer of the contract adds another account address as retailer. This account address then receives (marks as received) the product as a retailer. In the last stage, the deployer of the contract purchases the product and the life cycle is then completed.
        ![TransactionHistory](/Screenshots/TransactionHistory.png)
* Finally, if you want to deploy the smart contract to a public test network such as Rinkeby by yourself, you have to go back to the terminal shell window. At the root directory of this project, where the project files reside, type the command `truffle migrate --reset --network rinkeby`.

![RinkebyShellWindow](/Screenshots/RinkebyShellWindow.png)

After successful deployment, in my project, the contract address hash is: 0x0aa5234ea0992000cb1836d4063993c775b26c63. It can be accessed at Etherscan at https://rinkeby.etherscan.io/address/0x0aa5234ea0992000cb1836d4063993c775b26c63. 

![RinkebyContract](/Screenshots/RinkebyContract.png)

The transaction hash for contract creation is: 0x1e527e482ec7f4da662263ceffd0bd6bbdd3a0ed2470ca5cf97c9c18143e0f25.

![RinkebyTransaction](/Screenshots/RinkebyTransaction.png)

## Contributing

This repository contains all the work that makes up the project. Individuals and I myself are encouraged to further improve this project. As a result, I will be more than happy to consider any pull requests.