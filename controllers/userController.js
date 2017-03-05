// controllers/userController.js

var models = require("../models/models.js")

exports.autenticar = function(username, password, callback) {
    models.User.findOne({
        where: {
            username: username
        },
        include : [models.Employee]
    }).then(function(user) {
        if (user) {
          if (process.env.APP_ENV=='development') console.log("User: ", JSON.stringify(user));
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
