const mongoose = require("mongoose");
const url = "mongodb+srv://***REMOVED***:***REMOVED***@***REMOVED***/database";
const connect = mongoose.connect(url, {useNewUrlParser: true});
module.exports = connect;
