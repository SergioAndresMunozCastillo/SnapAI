const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const checkSchema = Schema({
    nombre: String,
    fecha: String,
    image: String
});

module.exports = mongoose.model("snapsmodels", checkSchema);