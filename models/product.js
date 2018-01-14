/**
 * Created by Huy on 13/01/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: {type: String, required: true},
    shortDescription: {type: String, required: true},
    longDescription: {type: String, required: true},
    price: {type: Number, required: true},
    img: {type: Object, required: true},
    availability: {type: Boolean, required: true},
    stockLevel: {type: Number, required: false}
});

module.exports = mongoose.model('Product', schema);