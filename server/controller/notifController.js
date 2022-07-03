const Notification = require('../models/notification.model')
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const logger = require("../logger/logger");

// Send Notifications to Customer
exports.sendNotif = async (req, res) => {
    const newNotif = new Notification({
        sender_id: req.user.id,
        reciever_email: req.body.customer_email,
        message: req.body.message,
        notiftype: req.body.notiftype
    })

    if (req.body.notiftype === 'view_request') {
        const response = await Notification.findOneAndUpdate({
            reciever_email: req.body.customer_email,
            notiftype: req.body.notiftype,
            dept: req.body.dept
        }, {
            $set: {
                permission_status: 'Pending',
                sender_id: req.user.id,
                timestamp: Date.now()
            }
        }).catch((err) => {
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in sending the view request notification", "recieverMail": req.body.customer_email, "dept": req.body.dept, "senderId": req.user.id });
            console.log(err);
        })
        if (response) {
            return res.status(200).json({ message: "Notification sent successfully" });
        }
    }

    if (req.body.notiftype === 'view_request' || req.body.notiftype === 'access_doc') {
        newNotif.dept = req.body.dept;
    }

    if (req.body.notiftype === 'pls_upload' || req.body.notiftype === 'access_doc') {
        newNotif.doctype = req.body.doctype;
    }

    if (req.body.notiftype === 'view_request') {
        newNotif.permission_status = 'Pending';
    }

    await newNotif
        .save()
        .catch((err) => {
            console.log(err)
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in saving the notification", "recieverMail": req.body.customer_email, "dept": req.body.dept, "senderId": req.user.id });
            return res.status(400).json({ error: err })
        });
    logger.info({ "ipaddress": req.connection.remoteAddress, "message": "Notification sent successfully", "recieverMail": req.body.customer_email, "dept": req.body.dept, "senderId": req.user.id });
    return res.status(200).json({ message: "Notification sent successfully" });
}

// Get Customer Notifs
exports.getNotifs = async (req, res) => {
    Notification
        .find({ reciever_email: req.user.email })
        .sort({ timestamp: 'desc' })
        .exec(async (err, result) => {
            if (err) {
                console.log(err);
                logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in getting the notification", "userid": req.user.id });
                return res.status(500).json({ error: "Some error occured" });
            }
            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "fetched the notifications successfully", "userid": req.user.id });
            return res.status(200).json(result);
        });
}

// Send mails to customer
exports.sendMail = async (req, res) => {
    // using yahoo SMTP
    const emailTransporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo',
        secure: false,
        auth: {
            user: "kharbanda.aryan00@yahoo.com",
            pass: "inyggomxopwbmcvy"
        },
        debug: false,
        logger: true
    });

    let mailOptions = {
        from: '"KYC 👻" <kharbanda.aryan00@yahoo.com>', // sender address
        to: req.body.customer_email, // list of receivers
        subject: "KYC Notification", // Subject line
        text: req.body.message, // plain text body
        // html: "<p>Hello World!</p>"
    };

    // send mail with defined transport object
    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in sending email", "recieverMail": req.body.customer_email });
            return res.status(400).json({ err: error });
        }
        console.log('Message sent: %s', info.messageId);
        logger.info({ "ipaddress": req.connection.remoteAddress, "message": "Mail sent successfully", "recieverMail": req.body.customer_email });
        return res.status(200).json({ messageId: info.messageId });
    });

}

// Check permission to access docs
exports.checkPermission = async (req, res) => {
    // const response = await User.findOne({email: req.body.customer_email}).catch((err) => console.log(err));
    // if(!response || (response && response.usertype!=='Customer')){
    //     return res.status(404)
    // }

    const notifs = await Notification
        .find({
            notiftype: "view_request",
            reciever_email: req.body.customer_email,
            dept: req.body.dept
        })
        .catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in checkPermission", "recieverMail": req.body.customer_email });
            return res.status(500).json({ err: error })
        })

    // no requests before
    if (notifs.length === 0) {
        return res.status(201).json({ message: "LOB did not request docs before" });
    }

    const lastNotif = notifs[0];

    // default permission_status -> pending permission
    if (lastNotif.permission_status === "Pending") {
        return res.status(202).json({ message: "Permission pending" })
    }
    // LOB can view docs now
    if (lastNotif.permission_status === "Approved") {
        return res.status(203).json({ message: "LOB is permitted to view doc" })
    }
    // has been denied, but "LOB can request again"
    if (lastNotif.permission_status === "Rejected") {
        return res.status(204).json({ message: "LOB has been denied permission" })
    }
}

// Accept Permission Request of any LOB
exports.requestaccept = async (req, res) => {
    const notifID = req.body.id;

    await Notification.updateOne(
        { _id: notifID },
        {
            $set: {
                permission_status: "Approved",
            },
        }
    ).exec((err, notif) => {
        if (err) {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in updating notif in requestaccept", "notifId": notifID });
            return res.status(500).json({ error: err });
        }
        if (notif.matchedCount === 1) {
            console.log("reject notif", notif);
            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "notif request accepted successfully", "notifId": notifID });
            return res.status(200).json({ message: "Updated Successfully" });
        }
        logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "no notif found in requestaccept", "notifId": notifID });
        return res.status(404).json({ message: "No such notif found" });
    });

}

// Reject Permission Request of any LOB
exports.requestreject = async (req, res) => {
    const notifID = req.body.id;

    await Notification.updateOne(
        { _id: notifID },
        {
            $set: {
                permission_status: "Rejected",
            },
        }
    ).exec((err, notif) => {
        if (err) {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in updating notif in requestreject", "notifId": notifID });
            return res.status(500).json({ error: err });
        }
        if (notif.matchedCount === 1) {
            // console.log("reject notif", notif);
            logger.info({ "ipaddress": req.connection.remoteAddress, "message": "notif request rejected successfully", "notifId": notifID });
            return res.status(200).json({ message: "Updated Successfully" });
        }
        logger.warn({ "ipaddress": req.connection.remoteAddress, "message": "no notif found in requestreject", "notifId": notifID });
        return res.status(404).json({ message: "No such notif found" });
    });

}

// Get all permission requests
exports.getpermissionreqs = async (req, res) => {
    Notification
        .find({
            notiftype: "view_request",
            reciever_email: req.user.email
        })
        .sort({ timestamp: 'desc' })
        .exec(async (err, result) => {
            if (err) {
                console.log(err);
                logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in getpermissionreqs", "recieverMail": req.user.email });
                return res.status(500).json({ error: "Some error occured" });
            }
            return res.status(200).json(result);
        });
}

// Check if notif already sent
exports.plsuploadcheck = async (req, res) => {
    const notifs = await Notification
        .find({
            reciever_email: req.body.customer_email,
            doctype: req.body.doctype,
            notiftype: "pls_upload"
        })
        .sort({ timestamp: 'desc' })
        .catch((err) => {
            console.log(err);
            logger.error({ "error": err, "ipaddress": req.connection.remoteAddress, "message": "error in plsuploadcheck", "recieverMail": req.body.customer_email });
            return res.status(400).json({ err: error })
        })

    //console.log(notifs)
    // no requests before
    if (notifs.length === 0) {
        return res.status(200).json({ message: "LOB can notify user" });
    }
    return res.status(201).json({ message: "LOB has already notified user" });
}