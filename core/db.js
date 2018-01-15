/**
 * Created by Huy on 15/01/2018.
 */

var mongoose = require('mongoose');
var config = require('./config');

var uri = 'mongodb://' + config.DB.USERNAME + ':' + config.DB.PASSWORD + '@' +
    config.DB.HOST + ':' + config.DB.PORT + '/' + config.DB.NAME;
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
    useMongoClient: true
});

module.exports = mongoose;