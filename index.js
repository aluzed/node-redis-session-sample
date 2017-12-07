/**
* Redis Session Sample
* From : https://codeforgeek.com/2015/07/using-redis-to-handle-session-in-node-js/
*/
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
const RedisStore = require('connect-redis')(session);
const configs = require('./configs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();

app.use(session({
    store: new RedisStore(_.assign(configs.sessionCfg, {client})),
    secret: configs.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

// Only json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    // create new session object.
    if(req.session.key) {
        // if email key is sent redirect.
        res.send('session ok');
    } else {
        // else go to home page.
        res.send('no session');
    }
});

app.post('/login', (req, res) => {
    // when user login set the key to redis.
    console.log(req.body.email);
    req.session.key = req.body.email;
    res.end('done');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, () => {
    console.log("App Started on PORT 3000");
});
