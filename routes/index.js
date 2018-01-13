// https://leflair-shopping-app.herokuapp.com/
var express = require('express');
var router = express.Router();
var Product = require('../models/product')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({
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
    var products = Product.find({}).select(select);
    if (req.query.availability) {
        products = products.where('availability').in(
            req.query.availability
        );
    }
    products.exec(function (err, docs) {
        res.send({
            data: docs
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
        var keyword = { $regex: new RegExp('.*' + req.params.keyword + '.*', "i")};

        if (req.query.name) {
            orSet.push({
                'name': keyword
            });
        }

        if (req.query.shortDescription) {
            orSet.push({
                'shortDescription': keyword
            });
        }

        products.find({
            $or: orSet
        }).select(select).exec(function (err, docs) {
            res.send({
                data: docs || []
            });
        });
    } else {
        res.send('404 Not Found', 404);
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

module.exports = router;
