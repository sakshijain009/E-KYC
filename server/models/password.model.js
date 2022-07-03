const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordSchema = new Schema(
    {
        user_id: {
            type: ObjectId,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = Password = mongoose.model("passwords", PasswordSchema);
