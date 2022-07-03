const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controller/userController');
const verifyAccess = require('../middleware/verifyAuthority');

// @route GET api/user/
// @desc Get User Data
// @access Public
router.get("/", verifyToken, userController.getUserData);

// @route GET api/user/customer/{email}/
// @desc Get User Data By Email (Used By LOB and Verifier to search users)
// @access LOB
router.get("/customer/:email/", verifyToken, verifyAccess.verifyBankOfficial, userController.getUserDataByEmail);

// @route GET api/user/customer/kyc/all
// @desc Get KYC requests of a Customer
// @access Customer
router.get("/customer/kyc/all/", verifyToken, verifyAccess.verifyCustomer, userController.getACustomersKYCRequest);

// @route GET api/user/kyc/all
// @desc Get KYC requests of All Customers
// @access Verifier
router.get("/kyc/all/", verifyToken, verifyAccess.verifyAdmin, userController.getAllKYCRequest);

router.get("/doc/all/:email", verifyToken, verifyAccess.verifyLOB, userController.getUserDataBasedOnDept);

router.get("/doc/specific/:email/:doctype", verifyToken, verifyAccess.verifyLOB, userController.getSpecificDoc);


// @route GET api/user/accesshist
// @desc Get access history of docs of customer
// @access Customer
router.get("/accesshist/", verifyToken, verifyAccess.verifyCustomer, userController.accessHist);

// @route GET api/user/verifier/docs
// @desc Get docs verified by the admin
// @access Verifier
router.get("/verifier/docs/", verifyToken, verifyAccess.verifyAdmin, userController.verifiedDocs);


module.exports = router;
