/**
 * Created by Huy on 15/01/2018.
 */

var config = require('./../core/config');
var mongoose = require('mongoose');
var isEmpty = require('lodash/isEmpty');

// Emailer
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates');
var hbs = require('nodemailer-express-handlebars');

// Model
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

// Checkout
module.exports = function (req, res, next) {
    if (isEmpty(req.session.cart) || isEmpty(req.session.cart.items)) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }

    var cart = new Cart(req.session.cart);
    var name = req.body.name;
    var toEmail = req.body.email;
    var address = req.body.address;

    productIds = cart.getProductIds();
    // console.log(productIds);
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
            return res.status(400).send(err);
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
                        return res.status(400).send(err);
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
                            return res.status(400).send(err);
                        }
                        req.session.cart = null;
                        console.info('Send mail.');
                        var transporter = nodemailer.createTransport(config.EMAIL);
                        transporter.use('compile', hbs({
                            viewPath: 'views/emails',
                            extName: '.hbs'
                        }));
                        transporter.sendMail({
                            from:  config.EMAIL.auth.user,
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
                                return res.status(400).send(err);
                            }
                            return res.status(200).send(response);
                        });
                    });

                });
            },
            function(error){
                return res.status(400).send(error);
            }
        );
    });

};