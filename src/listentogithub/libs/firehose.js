var github = require('octonode');

// Set Github client id and secret, as well as github account to use for
// oauth,in environmental variables.
var GITHUB_PAC = process.env.GITHUB_PAC;
var client = github.client(GITHUB_PAC);
var queryRate = (3600. / 5000) * 1000;
var store = [];

function getGithubEventRet(el) {
    return {
        user: el.actor.login,
        repository: el.repo.name,
        id: el.id,
        time: el.created_at,
        commits: el.payload.size,
        commitMessages: (function() {
            return el.payload.commits.map(function(el, i, ar) {
                return {
                    message: el.message,
                    url: el.url
                };
            });
        })()
    };

}

function getGithubEvents(cb) {
    /*
     * Callback function should do something with the payload.
     */
    client.get('/events', {}, function getEventCb(err, status, body, headers) {
        var out = body.filter(function filterCb(el, i, ar) {
            return el.type == "PushEvent";
        }).map(function mapCb(el, i, ar) {
            return getGithubEventRet(el)
        });
        if (cb) {
            cb(out);
        }
    });
}

function mergePayloadToStore(store, payload) {
    if (!store.length) {
        return payload;
    }
    var ar = [];
    var i = 0;
    while (i < payload.length && payload[i].id != store[0].id) {
        ar.push(payload[i]);
        i++;
    }
    return ar;
}

// The interval to hit Github API.
setInterval(function getGithubEventsInteralCb() {
    getGithubEvents(function getGithubEventsCb(payload) {
        var newData = mergePayloadToStore(store, payload);
        store = newData.concat(store);
        if (store.length > 50) {
            store = store.slice(0, 50);
        }
    });
}, queryRate);

function getStore() {
    return store;
}

module.exports = {
    getStore: getStore,
    queryRate: queryRate
};

