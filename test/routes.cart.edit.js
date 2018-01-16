/**
 * Created by Huy on 15/01/2018.
 */
process.env.NODE_ENV = 'test';

// var express = require('express');
var server = require('./../app');
var session = require('supertest-session');

var mongoose = require('mongoose');
var Product = require('./../models/product');
var Order = require('./../models/order');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var sinon = require('sinon');

chai.use(chaiHttp);

var testSession = null;

beforeEach(function () {
    testSession = session(server);
});

//Our parent block
describe('Cart (has items)', function() {
    /**
     * Fake Product
     */
    var product = new Product({
        name: 'Dutch Mill Strawberry',
        img: {
            main: 'https://www.mondenissin.com/uploads/images/products/dutchMill_strawberry3.png',
            imgSet: [
                'https://www.waangoo.com/content/images/thumbs/0008398_dutch-mill-yogurt-drink-strawberry-juice_600.jpeg',
                'https://www.bayanmall.com/image/cache/data/7-26-13/IMG_7910-700x700_0.jpg'
            ]
        },
        shortDescription: 'abc',
        longDescription: 'def',
        price: 1,
        availability: true,
        stockLevel: 10
    });
    var quantity = 1;
    var hasSessionTest = null;
    beforeEach(function (done) { //Before each test we setup the session
        Product.remove({}, function (err) {
            product.save(function (err, res) {
                testSession.delete('/cart')
                    .expect(204)
                    .end(function (err, res) {
                        testSession.post('/cart')
                            .send({productId: product.id, quantity: 1})
                            .expect(201)
                            .end(function (err) {
                                if (err) return done(err);
                                hasSessionTest = testSession;
                                return done();
                            });
                    });
            });
        });
    });


    /*
     * Test the /POST route
     */
    describe('/PUT cart', function() {
        var newQuantity = 2
        it('it should EDIT items from cart successful', function (done) {
            hasSessionTest.put('/cart/' + product.id)
                .send({productId: product.id, quantity: newQuantity})
                .expect(202)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.be.a('object');
                    res.body.items.should.be.a('object');
                    res.body.items.should.contain.keys(product.id);
                    res.body.totalQuantity.should.eql(newQuantity);
                    res.body.totalPrice.should.eql(newQuantity * product.price);
                    return done();
                });
        });
    });

});
