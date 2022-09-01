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
    }, 
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true 
    },
    avatar: { // el avatar será de tipo string ya que solo guardamos el nombre del archivo
        type: String,
        require: false
    }
});

module.exports = mongoose.model('users', UserSchema);
