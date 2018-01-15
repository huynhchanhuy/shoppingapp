/**
 * Created by Huy on 15/01/2018.
 */
var Cart = require('../../models/cart');
var isEmpty = require('lodash/isEmpty');
var isInteger = require('lodash/isInteger');

// Modify a cart's item.
module.exports = function (req, res, next) {
    if (!isInteger(req.body.quantity) || req.body.quantity < 0) {
        return res.status(400).send({
            'error': 'quantity is required and must be a positive integer number'
        });
    }
    if (isEmpty(req.session.cart) || isEmpty(req.session.cart.items)) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }
    var productId = req.params.productId;
    var quantity = req.body.quantity;
    var cart = new Cart(req.session.cart);
    if (quantity === 0) {
        console.info('Delete product ' + productId);
        cart.delete(productId).then(
            function(cart){
                req.session.cart = cart;
                return res.status(202).send(cart);
            },
            function(error){
                return res.status(400).send(error);
            }
        );
    } else {
        console.info('Edit product ' + productId);
        cart.edit(productId, quantity).then(
            function(cart){
                req.session.cart = cart;
                return res.status(202).send(cart);
            },
            function(error){
                return res.status(400).send(error);
            }
        );
    }
};