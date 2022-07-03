const User = require("../models/user.model");
const Doc = require("../models/doc.model");
const Dept = require("../models/department.model");
const logger = require("../logger/logger");
const Notification = require('../models/notification.model')

// To load user data when user logs in (LOB , Verifier, Customer)
exports.getUserData = async (req, res) => {

    await User.findOne({ _id: req.user.id }).then(async user => {
        if (user) {
            if (user.usertype === 'LOB') {
                const deptDetails = await Dept.findOne({ department: user.department }).catch((err) => {
                    console.log(err);
                    logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "department not found in database", "userid": req.user.id, "department": req.user.id });
                })

                if (!deptDetails) {
                    logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "department of lob not found", "userid": req.user.id, "department": req.user.id });
                    return res.status(404).json({ error: "Department of lob not found" });
                }
                let temp = user.toObject();
                temp.documents = deptDetails.doc_type;
                return res.status(200).json(temp);
            }
            else {
                return res.status(200).json(user);
            }
        }
        else {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "could not find the user data", "userid": req.user.id });
            return res.status(404).json({ error: "User not found" });
        }
    });
}


// To load user data when (LOB) searches user by email to access the kyc documents
exports.getUserDataByEmail = async (req, res) => {
    await User.findOne({ email: req.params.email }).then(user => {
        if (user && user.usertype === 'Customer') {

            Doc.find({ customer_id: user._id }).then(doc => {
                const userDataFromEmail = {
                    user: user,
                    documents: doc
                }
                return res.status(200).json(userDataFromEmail);
            });
        }
        else {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "could not find user data", "userMail": req.params.email });
            return res.status(404).json({ error: "Customer not found" });
        }
    });
}

// Get all KYC Requests (Can be accessed by verifier)
exports.getAllKYCRequest = async (req, res) => {
    try {
        await Doc.aggregate([
            { $match: { "status": "Pending" } },
            {
                "$group": { "_id": "$customer_id" }
            }
        ]).exec(async (err, result) => {

            let finalArrayofData = [];

            for (const element of result) {
                let userData = await User.find({ _id: element._id }).catch((err) => {
                    console.log(err);
                    logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error while searching the user in database", "userid": element._id });
                });
                let docInfoData = await Doc.find({ customer_id: element._id, status: "Pending" }).catch((err) => {
                    console.log(err);
                    logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error while finding docs for a user", "userid": element._id });
                });

                let finalData = {
                    customer: userData[0],
                    statusofDocs: docInfoData
                }
                finalArrayofData.push(finalData);
            }
            return res.status(200).json(finalArrayofData)
        });
    } catch (err) {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error occured int getAllKYCRequest", "userid": element._id });
        return res.status(400).json({ message: "Some error occurred!" })
    }

}

// Customer dashboard
exports.getACustomersKYCRequest = async (req, res) => {
    await Doc
        .find({ customer_id: req.user.id })
        .sort({ updatedAt: 'desc' })
        .then(doc => {
            if (doc && doc !== {}) {
                let sentData = [];
                for (const element in doc) {
                    const data = {
                        "Document": doc[element].doc_type,
                        "Status": doc[element].status,
                        "Submitted At": doc[element].createdAt.toLocaleString(),
                        "Approved/Rejected At": doc[element].status === 'Pending' ? "Not Applicable" : (doc[element].status === 'Rejected' ? doc[element].updatedAt.toLocaleString() + "; Rejection Reason : " + doc[element].reject_message : doc[element].updatedAt.toLocaleString())
                    }
                    sentData.push(data);
                }
                return res.status(200).json(sentData);
            }
            else {
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "no documents found for the customer", "userid": req.user.id });
                return res.status(404).json({ message: "There are no documents" });
            }
        }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "documents could not be fetched from database", "userid": req.user.id });
        });
}

// To load user data when according to the department docs of lob
exports.getUserDataBasedOnDept = async (req, res) => {

    const lobDetails = await User.findOne({ _id: req.user.id }).catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "LOB could not be found", "userid": req.user.id });
        return res.status(404).json({ error: "LOB unable to be found" });
    })

    const deptDetails = await Dept.findOne({ department: lobDetails.department }).catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "Department documents not found", "userid": req.user.id });
        return res.status(404).json({ error: "Department documents not found" });
    })

    await User.findOne({ email: req.params.email }).then(user => {
        if (user && user.usertype === 'Customer') {

            Doc.find({
                customer_id: user._id, doc_type: {
                    $in: deptDetails.doc_type
                }
            }).then(doc => {
                return res.status(200).json(doc);
            });
        }
        else {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Customer not found when searched by LOB", "userMail": req.params.email });
            return res.status(404).json({ error: "Customer not found" });
        }
    });

}

// To get customer docs for specific type
exports.getSpecificDoc = async (req, res) => {

    await User.findOne({ email: req.params.email }).then(user => {
        if (user && user.usertype === 'Customer') {
            Doc.find({
                customer_id: user._id,
                doc_type: req.params.doctype
            }).sort({ updatedAt: 'desc' })
                .exec(async (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Some error occured" });
                    }
                    return res.status(200).json(result);
                });
        }
        else {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "User not found", "userMail": req.params.email });
            return res.status(404).json({ error: "User Not Found" });
        }
    }).catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "could not find doc", "userid": req.params.email });
        return res.status(500).json({ error: "Some Error Occured" });
    });

}

// Customer's access history
exports.accessHist = async (req, res) => {
    const notifs = await Notification
        .find({
            notiftype: "access_doc",
            reciever_email: req.user.email
        })
        .catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding accesshistory", "userid": req.user.id });
            return res.status(500).json({ err: error })
        })
    return res.status(200).json(notifs);
}

// Verifiers's verified docs
exports.verifiedDocs = async (req, res) => {
    const docs = await Doc
        .find({
            approved_verifier_id: req.user.id
        })
        .catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding verified docs", "userid": req.user.id });
            return res.status(500).json({ err: error })
        })
    return res.status(200).json(docs);
}