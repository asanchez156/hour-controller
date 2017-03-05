// controllers/sessionController.js


// MW de autorizacion
exports.loginRequired = function(req, res, next) {
    //  ------------ debugueando---------------
    if(process.env.APP_ENV=='development'){
        req.session.user = {
          id: 1,
          username: "admin",
          mode: 1,
          employeeId: 0,
          employeeName: "admin",
          companyId: 0,
          companyName: "amdin"};
    }
    //  ------------ debugueando---------------
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

    var sha512 = require('js-sha512');
    var userController = require('./userController');

    var criptoPassword = sha512(password);

    userController.autenticar(username, criptoPassword, function(error, user) {
        if (error) {
            //It has to repeat the error because the page is loadded twice, it is and unknown error.
            //TODO It is needed to fix this.
            req.session.messages.error.push(error.message);
            req.session.messages.error.push(error.message);
            res.redirect("/");
        } else {
            req.session.user = {
                id: user.userId,
                username: user.username,
                employeeId: user.employeeId,
                //employeeName: user.EMPLEADO.name,
                //employeeSurname: user.EMPLEADO.surname,
                mode: user.userMode
            };
            if (process.env.APP_ENV=='development') console.log("Session user: ", JSON.stringify(req.session.user));
            res.redirect(req.session.redir || "/");
        }
    });
}

// DELETE /logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/");
}

exports.messages = function(req, res, next) {
    if(req.session.messages==undefined){
       req.session.messages = { error: [], success: [] };
       //console.log(req.session.messages);
    }
    next();
}
