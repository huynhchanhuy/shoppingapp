/**
 * Created by Huy on 15/01/2018.
 */
var Product = require('../../models/product');

/* GET product search. */
module.exports = function(req, res, next) {
    if (req.params.keyword) {
        var products = Product;
        var select = {};
        var orSet = [];
        var keyword = { $regex: new RegExp('.*' + req.params.keyword + '.*', 'i')};

        if (req.query._select) {
            var arrSelect = req.query._select.split(',');
            for (var i in arrSelect) {
                select[arrSelect[i]] = 1;
            }
        }

        if (req.query._qFields) {
            var qFields = req.query._qFields.split(',');
            if (qFields.indexOf('name') > -1) {
                orSet.push({
                    'name': keyword
                });
            }
            if (qFields.indexOf('shortDescription') > -1) {
                orSet.push({
                    'shortDescription': keyword
                });
            }
        }

        var find = {};
        if (req.query.availability) {
            find = {'availability': req.query.availability};
        }

        products = products.find(find).and([
            { $or: orSet }
        ]).select(select);

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
            Product.count(find).and([
                {$or: orSet}
            ]).exec(function(err, total) {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).send({
                    data: docs || [],
                    meta: {
                        total: total,
                        skip: skip,
                        limit: limit
                    }
                });
            });
        });
    } else {
        return res.status(404).send({
            'error': '404 Not Found'
        });
    }
};