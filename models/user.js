const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://34.219.102.133:27017/nodeauth', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Conexión de la base de datos exitosa!!'))
    .catch(err => console.error(err));

//esquema de usuario

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: {type: String, index: true},
    password: String
});

module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password,salt,function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}