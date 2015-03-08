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

function filterPayload(store, payload) {
    if (!store.length) {
        return payload;
    }
    for (var i = 0; i < payload.length; i++){
        if (payload[i].id == store[0].id) {
            break
        }
    }
    return payload.slice(0, i)
}

// The interval to hit Github API.
setInterval(function getGithubEventsInteralCb() {
    getGithubEvents(function getGithubEventsCb(payload) {
        var newData = filterPayload(store, payload);
        store = newData.concat(store);
        var now = new Date();
        var tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
        store.filter(function filterOldEvents(event) {
            return new Date(event.time) > tenSecondsAgo;
        });
    });
}, queryRate);

function getStore() {
    return store;
}

module.exports = {
    getStore: getStore,
    queryRate: queryRate
};

