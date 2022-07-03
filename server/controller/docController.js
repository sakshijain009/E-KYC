const upload = require("../middleware/upload");
const mongoose = require("mongoose");
const logger = require("../logger/logger");

let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "pdfFiles",
    });
    console.log(bucket);
});

// Load models
const User = require("../models/user.model");
const Doc = require("../models/doc.model");
const Doctypes = require("../models/doctypes.model");
const Dept = require("../models/department.model");

// Middleware to upload files
exports.uploadFiles = async (req, res) => {
    try {
        const docDetails = await Doc.find({
            customer_id: req.user.id,
            doc_type: req.body.doc_type,
        }).sort({ updatedAt: 'desc' })
            .catch((err) => {
                bucket.delete(req.file.id);
                console.log(err);
            });

        if (
            docDetails.length > 0 &&
            (docDetails[0].status === "Accepted" ||
                docDetails[0].status === "Pending")
        ) {
            bucket.delete(req.file.id);
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Cannot Re-upload the Document unless Rejected", "userid": req.user.id, "doctype": req.body.doc_type });
            return res
                .status(201)
                .json({
                    message: "Cannot Re-upload the Document unless Rejected",
                });
        }

        const fileData = new Doc({
            doc_type: req.body.doc_type,
            filename: req.file.filename,
            customer_id: req.user.id,
            file_id: req.file.id,
        });

        await fileData.save().catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in saving file data while uploading", "userid": req.user.id, "doctype": req.body.doc_type });
            return res.status(400).json({ error: err });
        });
        logger.info({ "ipaddress": req.connection.remoteAddress, "message": "file successfully sent for kyc", "userid": req.user.id, "doctype": req.body.doc_type });
        return res.status(200).json({
            message: "Files have been sent for KYC Request",
        });
    } catch (err) {
        bucket.delete(req.file.id);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in uploading file", "userid": req.user.id, "doctype": req.body.doc_type });
        return res.status(500).json({ err: err });
    }
};

exports.fetchFiles = async (req, res) => {
    const file = bucket
        .find({
            filename: req.params.filename,
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "no file found with given filename", "filename": req.params.filename });
                return res.status(404).json({
                    error: "no files exist",
                });
            }
            bucket.openDownloadStreamByName(req.params.filename).pipe(res);
        });
};

// Accept a document uploaded for kyc and set status accepted
exports.acceptStatusDoc = async (req, res) => {
    const id = req.params.id;
    const filename = req.params.filename;

    const response = await Doc.findOne({
        customer_id: id,
        filename: filename,
    }).catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding file data while accepting the doc", "userid": id, "filename": filename });
    });

    await Doc.updateOne(
        { _id: response._id },
        {
            $set: {
                approved_verifier_id: req.user.id,
                status: "Accepted",
                file_id: null,
            },
        }
    ).exec((err, doc) => {
        if (err) {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in updating file data while accepting the doc", "userid": req.user.id, "filename": filename });
            return res.status(500).json({ error: err });
        }
        if (doc.matchedCount === 1) {
            bucket.delete(response.file_id);
            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "accept status updated successfully", "userid": req.user.id, "filename": filename });
            return res.status(200).json({ message: "Updated Successfully" });
        }
        logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "error in accepting the doc", "userid": req.user.id, "filename": filename });
        return res.status(404).json({ message: "No such record found" });
    });
};

// To get all types of documents
exports.findAllDocTypes = async (req, res) => {
    const response = await Doctypes.find().catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in findAllDocTypes" });
    });
    return res.status(200).json(response);
};

// Add new types of documents
function capitalizeWords(arr) {
    return arr.map(element => {
        return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    });
}

exports.addNewDocs = async (req, res) => {
    try {
        const type = capitalizeWords(req.body.type.split(' ')).join(" ")
        const response = await Doctypes.findOne({ doctype: type }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding doctype in database", "doctype": type });
        });

        if (response) {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Document already exists", "doctype": type });
            return res.status(403).json({ error: "Document already exists" });
        }

        const doctype = new Doctypes({
            doctype: type
        });

        await doctype.save().catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in saving the doctype to database", "doctype": type });
            return res.status(400).json({ error: "Some Error Occurred" });
        });
        logger.info({ "ipaddress": req.connection.remoteAddress, "message": "new doctype added successfully", "doctype": type });
        return res.status(200).json({ message: "Doctype has been added successfully" });
    } catch (error) {
        console.log(error);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in addNewDocs", "doctype": type });
    }
};

// To add new departments and its docs
exports.addNewDeptsandItsDocs = async (req, res) => {
    try {
        const department_name = capitalizeWords(req.body.department.split(' ')).join(" ")
        const response = await Dept.findOne({ department: department_name }).catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding the department in database", "dept": department_name, "doctype": req.body.docs });
        });

        if (response) {
            logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "Department already exists", "dept": department_name, "doctype": req.body.docs });
            return res.status(403).json({ error: "Department already exists" });
        }

        const doctype = new Dept({
            doc_type: req.body.docs,
            department: department_name
        });

        await doctype.save().catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in saving the doctype to database", "dept": department_name, "doctype": req.body.docs });
            return res.status(400).json({ error: "Some Error Occurred" });
        });
        logger.info({ "ipaddress": req.connection.remoteAddress, "message": "new deartment added successfully", "dept": department_name, "doctype": req.body.docs });
        return res.status(200).json({ message: "Department has been added successfully" });
    } catch (error) {
        console.log(error);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in addNewDeptsandItsDocs", "dept": department_name, "doctype": req.body.docs });
    }
};

// To get all departments and their docs
exports.findAllDeptDocs = async (req, res) => {
    const response = await Dept.find().catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in findAllDeptDocs" });
    });

    return res.status(200).json(response);
};

// Reject a document uploaded for kyc and set status rejected
exports.rejectStatusDoc = async (req, res) => {
    const id = req.params.id;
    const filename = req.params.filename;
    const reject_message = req.body.reject_message;

    const response = await Doc.findOne({
        customer_id: id,
        filename: filename,
    }).catch((err) => {
        console.log(err);
        logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in finding file data while rejecting the doc", "userid": id, "filename": filename });
    });

    await Doc.updateOne(
        { _id: response._id },
        {
            $set: {
                approved_verifier_id: req.user.id,
                status: "Rejected",
                reject_message: reject_message,
                file_id: null,
            },
        }
    ).exec((err, doc) => {
        if (err) {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in updating file data while rejecting the doc", "userid": id, "filename": filename });
            return res.status(500).json({ error: err });
        }
        if (doc.matchedCount === 1) {
            bucket.delete(response.file_id);
            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "reject status updated successfully", "userid": req.user.id, "filename": filename });
            return res.status(200).json({ message: "Updated Successfully" });
        }
        logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "error in rejecting the doc", "userid": req.user.id, "filename": filename });
        return res.status(404).json({ message: "No such record found" });
    });
};
