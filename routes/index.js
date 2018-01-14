// https://leflair-shopping-app.herokuapp.com/
var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).send({
        name: 'Huy Huynh Chan',
        email: 'huynhchanhuy@gmail.com',
        description: 'Back-End NodeJS Developer Test'
    });
});

/* GET product listing. */
router.get('/products', function(req, res, next) {
    var select = {
        'name': 1, 'price': 1, 'shortDescription': 1, 'img.main': 1, 'availability': 1
    };

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
        Product.count(find, function(err, total) {
            res.send({
                data: docs || [],
                meta: {
                    total: total,
                    skip: skip,
                    limit: limit
                }
            });
        });
    });
});

/* GET product listing. */
router.get('/products.:mode/:keyword', function(req, res, next) {
    if (req.params.mode.toLowerCase() == 'search' && req.params.keyword) {
        var products = Product;
        var select = {
            'name': 1, 'price': 1, 'shortDescription': 1, 'img.main': 1, 'availability': 1
        };
        var orSet = [];
        var keyword = { $regex: new RegExp('.*' + req.params.keyword + '.*', 'i')};

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
            Product.count(find).and([
                {$or: orSet}
            ]).exec(function(err, total) {
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
       return res.status(404).send('404 Not Found');
    }
});

/* GET product detail. */
router.get('/products/:id', function(req, res, next) {
    Product.findById(req.params.id, function (err, docs) {
        res.send({
            data: docs
        });
    }).select({
        'name': 1, 'price': 1, 'longDescription': 1, 'img': 1, 'availability': 1
    });
});

router.post('/cart/', function (req, res, next) {
    if (!req.body.productId) {
        return res.status(400).send('product_id is required');
    }

    if (!(req.body.quantity && !isNaN(req.body.quantity) && req.body.quantity >= 0)) {
        return res.status(400).send('quantity is required');
    }
    var productId = req.body.productId;
    var quantity = req.body.quantity;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.status(404).send('404 Not Found');
        }
        cart.add(product, product.id, quantity);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.status(201).send('Added a item successful.');
    })
});

router.delete('/cart/', function (req, res, next) {
    console.log(req.session.cart);
    req.session.cart = null;
    res.status(205).send('Clear entire cart items.');
});

module.exports = router;
