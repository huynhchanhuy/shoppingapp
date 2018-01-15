/**
 * Created by Huy on 15/01/2018.
 */
var Product = require('../../models/product');
var Cart = require('../../models/cart');
var isInteger = require('lodash/isInteger');

// Add a item into cart.
module.exports = function (req, res, next) {
    if (!req.body.productId) {
        return res.status(400).send({
            'error': 'product_id is required'
        });
    }

    if (!isInteger(req.body.quantity) || req.body.quantity < 0) {
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
                'error': 'product_id is not found'
            });
        }
        cart.add(product, product.id, quantity).then(
            function(cart){
                req.session.cart = cart;
                console.log(req.session.cart);
                return res.status(201).send(cart);
            },
            function(error){
                return res.status(400).send(error);
            }
        );
    })
};