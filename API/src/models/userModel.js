const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = Schema({
    id: String,
    nombre: String,
    contr: String
});

module.exports = mongoose.model("usersmodels", userSchema);