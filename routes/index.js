// https://leflair-shopping-app.herokuapp.com/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).send({
        name: 'Huy Huynh Chan',
        email: 'huynhchanhuy@gmail.com',
        description: 'Back-End NodeJS Developer Test'
    });
});

/**
 * Router
 */
var productListRouter       = require('./products/list');
var productSearchRouter     = require('./products/search');
var productDetailRouter     = require('./products/detail');

var cartInsertRouter        = require('./cart/insert');
var cartListRouter          = require('./cart/list');
var cartEditRouter          = require('./cart/edit');
var cartClearAllRouter      = require('./cart/clear');
var cartDeleteRouter        = require('./cart/delete');

var checkoutRouter          = require('./checkout');

router.get('/products', productListRouter);
router.get('/products.search/:keyword', productSearchRouter);
router.get('/products/:id', productDetailRouter);

// Add a item into cart.
router.post('/cart/', cartInsertRouter);
// Get all cart's items.
router.get('/cart/', cartListRouter);
// Modify a cart's item.
router.put('/cart/:productId', cartEditRouter);
// Clear all cart's items.
router.delete('/cart/', cartClearAllRouter);
// Delete a cart's item.
router.delete('/cart/:productId', cartDeleteRouter);
// Checkout
router.post('/checkout', checkoutRouter);

module.exports = router;
