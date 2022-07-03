const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctypeSchema = new Schema({
    doctype: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Doctypes = mongoose.model("doctypes", doctypeSchema);
