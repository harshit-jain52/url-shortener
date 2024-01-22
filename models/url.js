const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  //   urlId: {
  //     type: String,
  //     required: true
  //   },
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
