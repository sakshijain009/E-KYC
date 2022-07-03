var express = require("express");
var router = express.Router();
const verifyToken = require('../middleware/verifyToken')

// GET request 
// Just a test API to check if server is working properly or not
router.get("/", function(req, res) {
	res.send("API is working properly !");
});

router.get("/check",verifyToken, function(req, res) {
	console.log(req.user);
	res.send("lmao");
});

module.exports = router;
