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

// Set Github client id and secret, as well as github account to use for
// oauth,in environmental variables.
GITHUB_PAC = process.env.GITHUB_PAC;
var client = github.client(GITHUB_PAC);
var queryRate = (3600 * 1.0 / 5000) * 1000;
var store = [];

var getGithubEvents = function(cb) {
    /* 
     * Callback function should do something with the payload.
     */
    client.get('/events', {}, function(err, status, body, headers) {
        var out = body.filter(function filterCb(el, i, ar) {
                return el.type == "PushEvent";
            }).map(function mapCb(el, i, ar) {
                ret = { user: el.actor.login,
                        repository: el.repo.name,
                        id: el.id,
                        time: el.created_at,
                        commits: el.payload.size,
                        commitMessages: (function(){
                            return el.payload.commits.map(function(el, i, ar) {
                                return { message: el.message,
                                         url: el.url };

                            });
                        })()
                    };
                return ret;
            });
        if(cb) {
            cb(out);
        }
    });
};

var mergePayloadToStore = function(store, payload) {
    if(! store.length) {
        return payload;
    }
    var ar = [];
    var i = 0;
    while(i < payload.length && payload[i].id != store[0].id) {
        ar.push(payload[i]);
        i++;
    }
    return ar;
};

// The interval to hit Github API.
var interval = setInterval(function() {
        getGithubEvents(function(payload) {
            newData = mergePayloadToStore(store, payload);
            store = newData.concat(store);
            if(store.length > 50){
                store = store.slice(0, 50);
            }
            io.emit("github payload", newData); 
        });
    }, queryRate);

io.on('connection', function(socket) {
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
