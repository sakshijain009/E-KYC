/* Compile And Push To Eth Network */
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
require("dotenv").config({ path: "./config.env" });
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const mnemonic = /* YOUR SEED PHRASE ... */
// const providerOrUrl = /* RINKEBY ENDPOINT */

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));


const file = fs.readFileSync("kyc.sol").toString();
console.log('File Generated');

var input = {
    language: "Solidity",
    sources: {
        "kyc.sol": {
            content: file,
        },
    },

    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

// var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log("Result : ", output);

const ABI = output.contracts["kyc.sol"]["kyc"].abi;
console.log('ABI Successful');
const bytecode = output.contracts["kyc.sol"]["kyc"].evm.bytecode.object;
console.log('ByteCode Successful');

// const ABI = undefined;

// COPY PASTE HERE
let mainAccount = process.env.mainAccount; //Ganache Account


// web3.eth.getAccounts().then((accounts) => {
//   // console.log("Accounts:", accounts);

//   mainAccount = accounts[0];

//   console.log("Default Account:", mainAccount);
// });

let ADDRESS = ''; //Contract Address

const contract = new web3.eth.Contract(ABI);

web3.eth.getAccounts().then((accounts) => {
    // console.log("Accounts:", accounts);

    mainAccount = accounts[0];

    console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: bytecode })
        .send({ from: mainAccount, gas: 4700000 })
        .on("receipt", (receipt) => {

            console.log("Contract Address:", receipt.contractAddress);
            ADDRESS = receipt.contractAddress;
        })
});

// You need to use the accountAddress details provided to Besu to send/interact with contracts

// const ABI = [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "email",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "docType",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "docHash",
// 				"type": "string"
// 			}
// 		],
// 		"name": "addDocument",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "payable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "allDocuments",
// 		"outputs": [
// 			{
// 				"internalType": "bytes32",
// 				"name": "email",
// 				"type": "bytes32"
// 			},
// 			{
// 				"internalType": "bytes32",
// 				"name": "docType",
// 				"type": "bytes32"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "docHash",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "email",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "docType",
// 				"type": "string"
// 			}
// 		],
// 		"name": "viewDocument",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]

// const mainAccount = '0x0Dd97865d71E1Af745efEFFC56ac0488a9bDAb5E';

// const acc_addr = mainAccount;

// const ADDRESS = '0xE266b6847B2B0E0b1885696Bb91bc80ae9E0353A';

// async function Add_Doc(username, doctype, dochash, deployedContractAbi, deployedContractAddress){
//   const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
//   const res = await contractInstance.methods.addDocument(username,doctype,dochash).send({from: mainAccount, gasPrice: "0xFFFF", gasLimit: "0xFFFFF"});
//   return res
// }


// async function view_Doc(username, doctype, deployedContractAbi, deployedContractAddress){
//   const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
//   const res = await contractInstance.methods.viewDocument(username, doctype).call();
//   console.log("The hash of the required doc is : "+ res);
//   return res
// }

// const res1 = Add_Doc("user1@gmail.com","PAN","QmR8XDVsnRj92gp11PeAYWiFxyKX29zZXzweRdp8et1Lba", ABI, ADDRESS);
// const res2 = view_Doc("user1@gmail.com","PAN", ABI, ADDRESS);