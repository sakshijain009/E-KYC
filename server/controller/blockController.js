const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const logger = require("../logger/logger");

const ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "email",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "docType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "docHash",
                "type": "string"
            }
        ],
        "name": "addDocument",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allDocuments",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "email",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "docType",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "docHash",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "email",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "docType",
                "type": "string"
            }
        ],
        "name": "viewDocument",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

// IF USING ganache-cli
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// IF USING ropsten deployed testnetwork
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const mnemonic = 'analyst perfect crunch draft error soft rule toilet secret rib desk vapor'
// const providerOrUrl = 'https://ropsten.infura.io/v3/9c9ce33525ce49809af51a4b21ba1dfd'

// const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
// const web3 = new Web3(provider);

// COPY PASTE HERE
const mainAccount = process.env.mainAccount;
const ADDRESS = process.env.ADDRESS;

exports.addHash = async (req, res) => {
    const contractInstance = new web3.eth.Contract(ABI, ADDRESS);

    console.log(req.body.username, req.body.doctype, req.body.dochash);
    await contractInstance.methods
        .addDocument(req.body.username, req.body.doctype, req.body.dochash)
        .send(
            { from: mainAccount, gasPrice: "0xFFFF", gasLimit: "0xFFFFF" }
        ).then(flag => {
            console.log(flag);
            if (flag) {
                console.log("Document hash has been saved.");
                logger.info({ "ipaddress": req.connection.remoteAddress, "message": "Hash successfully stored on blockchain", "userMail": req.body.username, "doctype": req.body.doctype });
                return res.status(200).json({ document: "Hash successfully stored on blockchain." })
            } else {
                console.log("Document hash already exists.");
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Document hash already exists", "userMail": req.body.username, "doctype": req.body.doctype });
                return res.status(400).json({ document: "Document hash already exists." });
            }
        }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in sending the document to blockchain", "userMail": req.body.username, "doctype": req.body.doctype });
        });
}

exports.viewHash = async (req, res) => {
    const contractInstance = new web3.eth.Contract(ABI, ADDRESS);

    console.log(req.body.username, req.body.doctype);
    await contractInstance.methods
        .viewDocument(req.body.username, req.body.doctype)
        .call()
        .then(hash => {
            if (hash == "Document hash not found!") {
                console.log("Document hash not found!");
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Document hash not found", "userMail": req.body.username, "doctype": req.body.doctype });
                return res.status(400).json({ document: "Document hash not found!" });
            } else if (hash == "Customer not found in the list!") {
                console.log("Customer not found in the list!");
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Customer mail doesnt exist on blockcahin", "userMail": req.body.username, "doctype": req.body.doctype });
                return res.status(400).json({ document: "Customer not found in the list!" });
            } else if (hash.length == 46) {
                console.log("Document hash has been retrieved.");
                logger.info({ "ipaddress": req.connection.remoteAddress, "message": "Document hash has been retrieved", "userMail": req.body.username, "doctype": req.body.doctype });
                return res.status(200).json({ document: hash })
            }
            return res.status(203).json({ error: "not correct hash format", document: hash })
        }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in recieving the document from blockchain", "userMail": req.body.username, "doctype": req.body.doctype });
        });
}