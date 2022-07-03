const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docSchema = new Schema({
    customer_id: {
        type: ObjectId
    },
    doc_type: {
        type: String
    },
    approved_verifier_id: {
        type: ObjectId
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    filename: {
        type: String
    },
    file_id: {
        type: ObjectId
    },
    reject_message: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = Document = mongoose.model("Document", docSchema);
