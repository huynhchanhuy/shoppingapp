/**
 * Created by Huy on 15/01/2018.
 */
var Product = require('../../models/product');
var isEmpty = require('lodash/isEmpty');

/* GET product detail. */
module.exports = function(req, res, next) {
    var select = {};
    if (req.query._select) {
        var arrSelect = req.query._select.split(',');
        for (var i in arrSelect) {
            select[arrSelect[i]] = 1;
        }
    }
    Product.findById(req.params.id, function (err, docs) {
        if (err || isEmpty(docs)) {
            // if (err) {
            //     console.log(err);
            // }
            return res.status(404).send({
                error: '404 Not Found'
            });
        }

        return res.status(200).send(docs);
    }).select(select);
};