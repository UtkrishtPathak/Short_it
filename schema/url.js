
//importing required modules
const mongoose = require("mongoose");

//Schema for storing the old and new urls together
const Schema = new mongoose.Schema(
    {
        orig_url:
        {
            type: String,
            required: true
        },
        _id:
        {
            type: String,
            required: true,
        }
    }
);

module.exports = mongoose.model("URL", Schema);