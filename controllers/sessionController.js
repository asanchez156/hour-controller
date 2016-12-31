// controllers/sessionController.js

// MW de autorizacion
exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// GET /login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    /*
    res.render('sessions/new', {
        errors: errors
    })*/
    console.log(errors);
}

// POST /login
exports.create = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var userController = require('./userController');
    userController.autenticar(username, password, function(error, user) {
        if (error) {
            console.log("entra en error");
            req.session.errors = [{
                "message": 'Se ha producido un error: ' + error
            }];
            console.log(error);
            res.redirect("/login");
        }
        else {
            req.session.user = {
                id: user.id,
                username: user.username,
                mode: user.mode
            };
            console.log("Redirect to page:" + req.session.redir);
            res.redirect("/hour");
        }
    });
}

// DELETE /logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/");
}