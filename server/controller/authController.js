const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");

// Load input validation
const validateRegisterInput = require("../validation/reg");
const validateLoginInput = require("../validation/login");

// Load models
const User = require("../models/user.model");
const Password = require("../models/password.model");


//Register User---------------------------------------------
exports.register = async (req, res) => {

    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        logger.warn({ "message": errors, "ipaddress": req.connection.remoteAddress });
        return res.status(400).json(errors);
    }
    await User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            logger.warn({ "message": 'User tried to register with an already registered email', "ipaddress": req.connection.remoteAddress });
            return res.status(400).json({ email: "Email already exists" });
        } else {

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                usertype: req.body.role,
            });

            if (req.body.role === 'LOB') {
                newUser.department = req.body.department;
            }

            const newPwd = new Password({
                user_id: "",
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPwd.password, salt, async (error, hash) => {
                    if (error) {
                        console.log(error);
                        logger.error({ "error": error, "message": "password hash could not be created during register", "ipaddress": req.connection.remoteAddress, "userMail": req.body.email });
                    }
                    newPwd.password = hash;
                    await newUser
                        .save()
                        .then(async (user) => {
                            newPwd.user_id = user._id;
                            await newPwd.save().catch((err) => {
                                console.log(err);
                                logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "password hash could not be saved in password collection during register", "userMail": req.body.email });
                            });
                            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "User successfully registered", "userMail": req.body.email });
                            res.status(200).json(user);
                        })
                        .catch((err) => {
                            console.log(err);
                            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "user details could not be saved in users collection during register", "userMail": req.body.email });
                        });
                });
            });
        }
    });
};


// login user------------------------------------------------
exports.login = async (req, res) => {

    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        logger.warn({ "message": errors, "ipaddress": req.connection.remoteAddress });
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    await User.findOne({ email }).then(async (user) => {
        // Check if user exists
        if (!user) {
            logger.warn({ "message": 'User tried to login with an unregistered email', "ipaddress": req.connection.remoteAddress });
            return res.status(404).json({ error: "Email not found" });
        }

        let doc = await Password.findOne({ user_id: user._id }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "password not found in databse", "userMail": email });
        });

        // Check password
        bcrypt.compare(password, doc.password).then((isMatch) => {
            if (isMatch) {

                // User matched -> Create JWT Payload       
                const payload = {
                    id: user._id,
                    name: user.name,
                    usertype: user.usertype,
                    email: user.email
                };

                // Sign token
                jwt.sign(
                    payload,
                    process.env.secretOrKey,
                    {
                        expiresIn: 86400, // 1 day in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token,
                        });
                    }
                );
                logger.info({ "ipaddress": req.connection.remoteAddress, "userMail": email, "message": "user logged in" });
            } else {
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "User entered incorrect password", "userMail": email });
                return res
                    .status(400)
                    .json({ error: "Password incorrect" });
            }
        });
    });
};
