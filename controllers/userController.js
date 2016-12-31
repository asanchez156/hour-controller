// controllers/userController.js

var models = require("../models/models.js")

var users = {
    admin: {
        id: 1,
        username: "admin",
        password: "admin",
        mode: 0
    },
    user: {
        id: 2,
        username: "user",
        password: "user",
        mode: 1
    },
};

exports.autenticar = function(username, password, callback) {
    /*models.User.findAll({
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
                next(new Error('Usuario incorrecto');
            }
    });*/

    
    if (users[username]) {
        if (password === users[username].password) {
            callback(null, users[username]);
            console.log("success");
        }
        else {
            callback(new Error('Password erroneo'));
        }
    } else {
        callback(new Error('Usuario incorrecto'));
    }
};