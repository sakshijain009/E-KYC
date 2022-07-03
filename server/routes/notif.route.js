const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyAccess = require('../middleware/verifyAuthority');
const notifController = require('../controller/notifController');

// @route api/notif/send
// @desc Send notification to customer
router.post("/send", verifyToken, verifyAccess.verifyBankOfficial, notifController.sendNotif)

// @route api/notif/user
// @desc Get customer notifications
router.get("/user", verifyToken, verifyAccess.verifyCustomer, notifController.getNotifs)

// @route api/notif/mail
// @desc Send mail of notification
router.post("/mail", notifController.sendMail)

// @route api/notif/permission/check
// @desc Check if an LOB has permission to view user's documents
router.post("/permission/check", verifyToken, verifyAccess.verifyLOB, notifController.checkPermission)

// @route api/notif/permission/request/(accept||reject)
// @desc LOB requests permission to view user's documents
router.post("/permission/request/accept", verifyToken, verifyAccess.verifyCustomer, notifController.requestaccept)
router.post("/permission/request/reject", verifyToken, verifyAccess.verifyCustomer, notifController.requestreject)

// @route api/notif/getpermissionreqs
// @desc LOB requests permission to view user's documents
router.post("/getpermissionreqs", verifyToken, verifyAccess.verifyCustomer, notifController.getpermissionreqs)

// @route api/notif/plsupload/request
// @desc LOB requests permission to view user's documents
router.post("/plsuploadcheck", verifyToken, verifyAccess.verifyLOB, notifController.plsuploadcheck)

module.exports = router;
