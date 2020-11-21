const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TestySchema = Schema({
    name: String, 
    path: String
});

module.exports = mongoose.model("Testmodel", TestySchema);