var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var mysql      = require('mysql');
var bodyParser = require('body-parser');

var config = require('./config');
var routes = require('./routes/index');

//require('dotenv').load(); // para cargar variables de entorno desde el fichero .env

var app = express();

//console.log("host: " + config.mysql.host);
//console.log("user: " + config.mysql.user);
//console.log("password: " + config.mysql.password);
//console.log("database: " + config.mysql.database);
/*
var connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

connection.connect(function(err){
    if(!err) {
        console.log("Base de datos conectada \n");  
    } else {
        console.log("Error al conectar la base de datos ... \n");  
        console.log(err);
    }
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('hour-controller-2017'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(partials());
app.use(methodOverride('_method'));
app.use(session());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', routes);

// Helpers dinamicos:
app.use(function(req, res, next) {
    // guardar path en session.redir para redirigir tras login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

/// error handlers

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

<<<<<<< HEAD
=======
/// error handlers

>>>>>>> origin/master
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
