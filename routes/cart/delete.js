/**
 * Created by Huy on 15/01/2018.
 */
var Cart = require('../../models/cart');
var isEmpty = require('lodash/isEmpty');

// Delete a cart's item.
module.exports = function (req, res, next) {
    var productId = req.params.productId;
    if (isEmpty(req.session.cart) || isEmpty(req.session.cart.items)) {
        return res.status(400).send({
            'error': 'No cart data'
        });
    }
    var cart = new Cart(req.session.cart);
    cart.delete(productId).then(
        function(cart){
            req.session.cart = cart;
            return res.status(202).send(cart);
        },
        function(error){
            return res.status(400).send(error);
        }
    );
};