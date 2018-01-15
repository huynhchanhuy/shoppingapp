/**
 * Created by Huy on 15/01/2018.
 */
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');

module.exports = session({
    secret: config.SESSION.secret,
    resave: config.SESSION.resave,
    saveUninitialized: config.SESSION.saveUninitialized,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {maxAge: config.SESSION.expiration * 1000} // 3 hours
});