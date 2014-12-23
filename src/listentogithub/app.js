var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var github = require('octonode');
var http = require('http');
var debug = require('debug')('listentogithub');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);


var routes = require('./routes/index');
var users = require('./routes/users');

// Set Github client id and secret, as well as github account to use for
// oauth,in environmental variables.
GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID, 
    GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET, 
    GITHUB_UNAME = process.env.GITHUB_UNAME,
    GITHUB_PW = process.env.GITHUB_PW,
    GITHUB_PAC = process.env.GITHUB_PAC,
    EVENTS_ENDPOINT = "https://api.github.com/events/";
var client = github.client(GITHUB_PAC);
var queryRate = (3600 * 1.0 / 5000) * 1000;
//var eventQueue = 
var getGithubEvents = function() {
    client.get('/events', {}, function(err, status, body, headers) {
        console.log(body);
    });
};
/*var interval = setInterval(getGithubEvents, queryRate);*/

io.on('connection', function(socket) {
    socket
    console.log('a user connected');
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


module.exports = app;
