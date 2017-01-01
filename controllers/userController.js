// controllers/userController.js

var models = require("../models/models.js")

exports.autenticar = function(username, password, callback) {
    models.User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
            if (user) {
                if (password === user.password) {
                    callback(null, user);
                }
                else {
                    callback(new Error('Password erroneo'));
                }
            } else {
                callback(new Error('Usuario incorrecto'));
            }
    });
};