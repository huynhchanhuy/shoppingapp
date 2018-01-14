/**
 * Created by Huy on 13/01/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    cart: {type: Object, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
});

module.exports = mongoose.model('Order', schema);