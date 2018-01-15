/**
 * Created by Huy on 15/01/2018.
 */
var Cart = require('../../models/cart');

// Get all cart's items.
module.exports = function (req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    return res.status(200).send(cart);
};