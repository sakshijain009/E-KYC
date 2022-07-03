const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        sender_id: {
            type: ObjectId,
            required: true
        },
        reciever_email: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true
        },

        // to identify doc
        doctype: {
            type: String
        },

        // to classify notifications
        notiftype: {
            type: String,
            enum: ["ver_accept", "ver_reject", "pls_upload", "access_doc", "view_request"]
        },

        // for permission notifs
        dept: {
            type: String
        },
        permission_status: {
            type: String,
            enum : ["Pending", "Approved", "Rejected"]
        }
    }
);

module.exports = Notification = mongoose.model("notifications", NotificationSchema);
