const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const updateSchema = Schema({
    id: String,
    user_id: String,
    nombre: String,
    fecha: String,
    image: String
});

module.exports = mongoose.model("snapsmodels", updateSchema);