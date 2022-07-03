const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deptSchema = new Schema({
    department: {
        type: String
    },
    doc_type: {
        type: Array
    }
});

module.exports = Dept = mongoose.model("depts", deptSchema);
