/**
 * Created by Huy on 15/01/2018.
 */
var Product = require('../../models/product');

/* GET product listing. */
module.exports = function(req, res, next) {
    var select = {};

    if (req.query._select) {
        var arrSelect = req.query._select.split(',');
        for (var i in arrSelect) {
            select[arrSelect[i]] = 1;
        }
    }

    var find = {};
    if (req.query.availability) {
        find = {'availability': req.query.availability};
    }

    var products = Product.find(find).select(select);

    var limit = null;
    if (req.query._limit && !isNaN(req.query._limit) && req.query._limit >= 0) {
        limit = parseInt(req.query._limit);
        products = products.limit(limit);
    }

    var skip = null;
    if (req.query._skip && !isNaN(req.query._skip) && req.query._skip >= 0) {
        skip = parseInt(req.query._skip);
        products = products.skip(skip);
    }

    products.exec(function (err, docs) {
        if (err) {
            return res.status(400).send(err);
        }
        Product.count(find, function(err, total) {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send({
                data: docs || [],
                meta: {
                    total: total,
                    skip: skip,
                    limit: limit
                }
            });
        });
    });
};