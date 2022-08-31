const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
        require: false
    },
    lastname: {
        type: String,
        require: false 
    }, // email y password serán obligatorios:
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true 
    }
});

module.exports = mongoose.model('users', UserSchema);
