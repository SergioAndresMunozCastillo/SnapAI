const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SnapSchema = Schema({
    id: String,
    user_id: String,
    nombre: String,
    fecha: String,
    image: String
});

module.exports = mongoose.model("SnapsModel", SnapSchema);