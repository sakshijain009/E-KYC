const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        usertype: {
            type: String,
            enum: ['LOB', 'Verifier', 'Customer'],
            default: 'Customer'
        },
        department: {
            // only required by usertype LOB
            type: String,
            // enum: ['Home Loan', 'Credit Card']
        }
    },
    { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
