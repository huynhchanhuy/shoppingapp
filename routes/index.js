// https://leflair-shopping-app.herokuapp.com/
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ENV = require('../.env.json');

// Emailer
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates');
var hbs = require('nodemailer-express-handlebars');

// Model
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

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
        if (err) {
            res.status(400).send(err);
        }
        Product.count(find, function(err, total) {
            if (err) {
                res.status(400).send(err);
            }
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
            if (err) {
                res.status(400).send(err);
            }
            Product.count(find).and([
                {$or: orSet}
            ]).exec(function(err, total) {
                if (err) {
                    res.status(400).send(err);
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
});

/* GET product detail. */
router.get('/products/:id', function(req, res, next) {
    Product.findById(req.params.id, function (err, docs) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send({
            data: docs
        });
    }).select({
        'name': 1, 'price': 1, 'longDescription': 1, 'img': 1, 'availability': 1
    });
});

// Add a item into cart.
router.post('/cart/', function (req, res, next) {
    if (!req.body.productId) {
        return res.status(400).send({
            'error': 'product_id is required'
        });
    }

    if (!(req.body.quantity && !isNaN(req.body.quantity) && req.body.quantity >= 0)) {
        return res.status(400).send({
            'error': 'quantity is required'
        });
    }
    var productId = req.body.productId;
    var quantity = req.body.quantity;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId).select(
        {name: 1, price: 1, availability:1, img: 1}
    ).exec(function (err, product) {
        if (err) {
            return res.status(404).send({
                'error': '404 Not Found'
            });
        }
        cart.add(product, product.id, quantity).then(
            function(cart){
                req.session.cart = cart;
                console.log(req.session.cart);
                res.status(201).send(cart);
            },
            function(error){
                res.status(400).send(error);
            }
        );
    })
});

// Get all cart's items.
router.get('/cart/', function (req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    res.status(200).send(cart);
});

// Modify a cart's item.
router.put('/cart/:productId', function (req, res, next) {
    if (!(req.body.quantity && !isNaN(req.body.quantity) && req.body.quantity >= 0)) {
        return res.status(400).send({
            'error': 'quantity is required'
        });
    }
    if (!req.session.cart) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }
    var productId = req.params.productId;
    var quantity = req.body.quantity;
    var cart = new Cart(req.session.cart);
    cart.edit(productId, quantity).then(
        function(cart){
            req.session.cart = cart;
            res.status(202).send(cart);
        },
        function(error){
            res.status(400).send(error);
        }
    );
});

// Clear all cart's items.
router.delete('/cart/', function (req, res, next) {
    console.log(req.session.cart);
    req.session.cart = null;
    res.status(204).send();
});

// Delete a cart's item.
router.delete('/cart/:productId', function (req, res, next) {
    var productId = req.params.productId;
    if (!req.session.cart) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }
    var cart = new Cart(req.session.cart);
    cart.delete(productId).then(
        function(cart){
            req.session.cart = cart;
            res.status(202).send(cart);
        },
        function(error){
            res.status(400).send(error);
        }
    );
});

// Checkout
router.post('/checkout', function (req, res, next) {
    if (!req.session.cart) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }

    var cart = new Cart(req.session.cart);
    var name = req.body.name;
    var toEmail = req.body.email;
    var address = req.body.address;

    productIds = cart.getProductIds();
    console.log(productIds);
    Product.find({
        $and : [
            {
                _id: {
                    $in: productIds
                }
            }
        ]
    }).select({stockLevel: 1, availability: 1}).exec(function (err, products) {
        if (err) {
            res.status(400).send(err);
        }
        cart.checkout(products).then(
            function(objProducts){
                var order = new Order({
                    name: name,
                    email: toEmail,
                    address: address,
                    cart: cart
                });
                order.save(function (err, result) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    var bulkProduct = Product.collection.initializeUnorderedBulkOp();
                    for (var objProductId in objProducts) {
                        bulkProduct.find({
                            '_id': mongoose.Types.ObjectId(objProductId)
                        }).update({
                            $set: {
                                availability: objProducts[objProductId].availability,
                                stockLevel: objProducts[objProductId].stockLevel
                            }
                        });
                    }

                    bulkProduct.execute(function(err, result) {
                        if (err) {
                            res.status(400).send(err);
                        }
                        req.session.cart = null;
                        console.log('Send mail.');
                        var transporter = nodemailer.createTransport(ENV.EMAIL);
                        transporter.use('compile', hbs({
                            viewPath: 'views/emails',
                            extName: '.hbs'
                        }));
                        transporter.sendMail({
                            from:  ENV.EMAIL.auth.user,
                            to: toEmail,
                            subject: 'Thank you for your order.',
                            template: 'order-confirmation',
                            context: {
                                name: name,
                                address: address,
                                email: toEmail,
                                totalPrice: cart.totalPrice,
                                items: cart.items,
                                orderCode: result.id
                            }
                        }, function (err, response) {
                            if (err) {
                                res.status(400).send(err);
                            }
                            res.status(200).send(response);
                        });
                    });

                });
            },
            function(error){
                res.status(400).send(error);
            }
        );
    });

});

module.exports = router;
