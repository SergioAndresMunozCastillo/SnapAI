const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SnapSchema = Schema({
    fecha: String, 
    image: String
});

module.exports = mongoose.model("SnapsModel", SnapSchema);