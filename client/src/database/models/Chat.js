const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatModel = new Schema(
    {
        message: {
            type: String
        },
        sender: {
            type: String
        }
    },
    {
        timestamps: true
    });

let Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
