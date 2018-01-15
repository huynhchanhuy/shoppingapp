/**
 * Created by Huy on 15/01/2018.
 */

// Clear all cart's items.
module.exports = function (req, res, next) {
    console.log(req.session.cart);
    req.session.cart = null;
    res.status(204).send();
};
