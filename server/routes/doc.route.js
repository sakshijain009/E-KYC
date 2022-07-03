const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');
const verifyAccess = require('../middleware/verifyAuthority');
const docController = require('../controller/docController');
const blockController = require('../controller/blockController');


// @route POST api/doc/upload
// @desc Upload document for KYC by customer
// @access Public
router.post("/upload", verifyToken, upload.single("file"), docController.uploadFiles);

// @route Get api/doc/fileinfo/:filename
// @desc View uploaded document for KYC by customer
// @access Verifier/Admin
router.get("/fileinfo/:filename", docController.fetchFiles);

// @route POST api/doc/puthashblock
// @desc Approve KYC request
// @access Verifier
router.post("/puthashblock/", blockController.addHash);

router.post("/gethashblock/", blockController.viewHash);

// @route GET api/doc/reject/{id}/{filename}
// @desc Reject a user document request KYC
// @access Verifier
router.post("/accept/:id/:filename", verifyToken, verifyAccess.verifyAdmin, docController.acceptStatusDoc);
router.post("/reject/:id/:filename", verifyToken, verifyAccess.verifyAdmin, docController.rejectStatusDoc);

// @route GET api/doc/doctypes
// @desc Get all Doctypes
// @access Public
router.get("/doctypes",docController.findAllDocTypes);
router.get("/dept",docController.findAllDeptDocs);

// @route POST api/doc/add
// @desc Add new Doctypes
// @access Public
router.post("/add",docController.addNewDocs);

// @route POST api/doc/dept/add
// @desc Add new Department and its Documents
// @access Public
router.post("/dept/add",docController.addNewDeptsandItsDocs);

module.exports = router;

