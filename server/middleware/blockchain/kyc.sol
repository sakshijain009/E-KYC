// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
 
contract kyc {
   
    // admin var to store the address of the admin
    // address admin;
   
    //  Struct Document
    //  email - email-id of the customer
    //  docType - type of document
    //  docHash - hash of document
    
    struct Document{
        bytes32 email;
        bytes32 docType;
        string docHash;
    }

    //  List of all documents
    Document[] public allDocuments;
 
    //Setting the admin as the person who deploys the smart contract onto the network.
    // constructor() {
    //     admin = msg.sender;
    // }
   
    // Function will add a document to the customer list.
    // @param userName - customer name as the string
    // @param docType - Type of the document as the string
    // @param docHash - Hash of the document as the string
 
    // function addDocument(string memory email, string memory docType, string memory docHash) public payable returns (bytes32) {
    function addDocument(string memory email, string memory docType, string memory docHash) public payable returns (uint){
        bytes32 _email = keccak256(abi.encodePacked(email));
        bytes32 _docType = keccak256(abi.encodePacked(docType));
        for(uint i = 0; i < allDocuments.length; ++ i) {
            if((allDocuments[i].email == _email) && (allDocuments[i].docType == _docType)){
                return 0;
            } 
        }
        allDocuments.push(Document(_email, _docType, docHash));
        return 1;
        // return allDocuments[allDocuments.length-1].email;
    }

    // Function allows a dept to view details of a customer.
    // @param userName - customer name as string.
    // @return docHash - hash of the customer data in form of a string if it exists.
    // @return "Document not found!" if some document of the customer exists.
    // @return "Customer not found in the list!" if no document for the customer exists.

    function viewDocument(string memory email, string memory docType) public view returns(string memory) {
        uint flag = 0;
        bytes32 _email = keccak256(abi.encodePacked(email));
        bytes32 _docType = keccak256(abi.encodePacked(docType));
        for(uint i = 0; i < allDocuments.length; ++ i) {
            if((allDocuments[i].email == _email) && (allDocuments[i].docType == _docType)){
                return allDocuments[i].docHash;
            }
            else if(allDocuments[i].email == _email) {
                flag = 1;
            }
        }
        if (flag==1) {
            return "Document not found!";
        }
        else {
            return "Customer not found in the list!";
        }
    }
   
    // Utility Function to check the equality of two string variables
    function stringsEquals(string storage _a, string memory _b) internal view returns (bool) {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        for (uint i = 0; i < a.length; i ++)
        {
            if (a[i] != b[i])
                return false;
        }
        return true;
    }
}