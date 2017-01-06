// controllers/sessionController.js

// MW de autorizacion
exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// POST /login
exports.create = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var userController = require('./userController');
    userController.autenticar(username, password, function(error, user) {
        if (error) {
            req.session.error = [{
                "message": error.message
            }];
            res.redirect("/login/error");
        }
        else {
            req.session.user = {
                id: user.userId,
                username: user.username,
                mode: user.mode
            };
            res.redirect("/hour");
        }
    });
}

// DELETE /logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/");
}