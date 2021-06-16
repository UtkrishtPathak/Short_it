
//importing required modules
const mongoose      = require("mongoose"),
      ShortUinqueId = require("short-unique-id"),
      uid           = ShortUinqueId();

const Schema = new mongoose.Schema(
    {
        orig_url:
        {
            type: String,
            required: true
        },
        new_uid:
        {
            type: String,
            required: true,
            default: "http://localhost:1000/"+uid()
        }
    }
);

module.exports = mongoose.model("URL", Schema);