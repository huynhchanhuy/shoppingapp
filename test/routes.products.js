/**
 * Created by Huy on 15/01/2018.
 */
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var Product = require('./../models/product');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./../app');
var should = chai.should();
var sinon = require('sinon');

chai.use(chaiHttp);
//Our parent block
describe('Product', function() {
    beforeEach(function (done) { //Before each test we empty the database
        Product.remove({}, function (err) {
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET products', function() {
        it('it should GET all AVAILABLE products', function(done) {
            var product = new Product({
                name: 'Dutch Mill Strawberry',
                img: {
                    main: 'https://www.mondenissin.com/uploads/images/products/dutchMill_strawberry3.png',
                    imgSet: [
                        'https://www.waangoo.com/content/images/thumbs/0008398_dutch-mill-yogurt-drink-strawberry-juice_600.jpeg',
                        'https://www.bayanmall.com/image/cache/data/7-26-13/IMG_7910-700x700_0.jpg'
                    ]
                },
                shortDescription: 'Dutch Mill brings a yoghurt drink that contains the goodness of milk.',
                longDescription: 'Dutch Mill brings a yoghurt drink that contains the goodness of milk, yoghurt, and real fruit juice. It has calcium from fresh cows’ milk and cultured yoghurt, fermented by Lactobacillus bulgaricus and Streptococcus thermophillus, which is ultra-heat treated under aseptic conditions. Dutch Mill is not only nutritious but is also made to be delicious with the different fruit juice flavors kids can choose from.',
                price: 1,
                availability: true,
                stockLevel: 10
            });
            product.save(function (err, res) {
                chai.request(server)
                    .get('/products?_select=name,price,shortDescription,availability,img.main&availability=true')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.be.a('array');
                        res.body.data[0].should.have.property('_id').eql(product.id);
                        res.body.data[0].should.have.property('name');
                        res.body.data[0].should.have.property('img');
                        res.body.data[0].img.should.have.property('main');
                        res.body.data[0].img.should.not.have.property('imgSet');
                        res.body.data[0].should.have.property('shortDescription');
                        res.body.data[0].should.have.property('price');
                        res.body.data[0].should.have.property('availability');
                        res.body.data[0].should.not.have.property('longDescription');
                        res.body.data[0].should.not.have.property('stockLevel');
                        res.body.should.have.property('meta');
                        res.body.meta.should.be.a('object');
                        res.body.meta.should.have.property('total').eql(1);
                        res.body.meta.should.have.property('skip').eql(null);
                        res.body.meta.should.have.property('limit').eql(null);
                        done();
                    });
            });
        });

        it('it should GET all the products with params: _limit, _skip', function(done) {
            chai.request(server)
                .get('/products?_limit=1&_skip=1&_select=name,price,shortDescription,availability,img.main&availability=true')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').eql([]);
                    res.body.should.have.property('meta');
                    res.body.meta.should.have.property('total').eql(0);
                    res.body.meta.should.have.property('skip').eql(1);
                    res.body.meta.should.have.property('limit').eql(1);
                    done();
                });
        });
    });

    /*
     * Test the /GET/:id route
     */
    describe('/GET/:id products', function() {
        it('it should GET a product by the given id', function (done) {
            var product = new Product({
                name: 'Dutch Mill Strawberry',
                img: {
                    main: 'https://www.mondenissin.com/uploads/images/products/dutchMill_strawberry3.png',
                    imgSet: [
                        'https://www.waangoo.com/content/images/thumbs/0008398_dutch-mill-yogurt-drink-strawberry-juice_600.jpeg',
                        'https://www.bayanmall.com/image/cache/data/7-26-13/IMG_7910-700x700_0.jpg'
                    ]
                },
                shortDescription: 'Dutch Mill brings a yoghurt drink that contains the goodness of milk.',
                longDescription: 'Dutch Mill brings a yoghurt drink that contains the goodness of milk, yoghurt, and real fruit juice. It has calcium from fresh cows’ milk and cultured yoghurt, fermented by Lactobacillus bulgaricus and Streptococcus thermophillus, which is ultra-heat treated under aseptic conditions. Dutch Mill is not only nutritious but is also made to be delicious with the different fruit juice flavors kids can choose from.',
                price: 1,
                availability: true,
                stockLevel: 10
            });
            product.save(function (err, product) {
                chai.request(server)
                    .get('/products/' + product.id + '?_select=name,img,longDescription,price,availability')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('img');
                        res.body.img.should.have.property('main');
                        res.body.img.should.have.property('imgSet');
                        res.body.should.have.property('longDescription');
                        res.body.should.have.property('price');
                        res.body.should.have.property('availability');
                        res.body.should.not.have.property('shortDescription');
                        res.body.should.not.have.property('stockLevel');
                        res.body.should.have.property('_id').eql(product.id);
                        done();
                    });
            })
        });

        it('it should NOT GET a product because of wrong given id', function (done) {
            chai.request(server)
                .get('/products/123456')
                .end(function (err, res) {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    /*
     * Test the /GET/products.search route
     */
    describe('/GET/:keyword products.search', function() {
        it('it should GET AVAILABLE products by the given keyword "fanta" which is MATCHED with the name', function (done) {
            var products = [
                new Product({
                    name: 'Fanta',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/fanta-can-small-183-208-cefd1676.png',
                        imgSet: [
                            'https://i2-prod.mirror.co.uk/incoming/article10431848.ece/ALTERNATES/s810/Fanta.jpg'
                        ]
                    },
                    shortDescription: 'short description 1',
                    longDescription: '',
                    price: 10,
                    availability: true,
                    stockLevel: 10
                }),
                new Product({
                    name: 'Odwalla',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/odwalla-bottle-small-183-208-cff510ee.jpg',
                        imgSet: []
                    },
                    shortDescription: 'Nothing here',
                    longDescription: '',
                    price: 50,
                    availability: false,
                    stockLevel: 0
                })
            ];
            Product.collection.insertMany(products, function (err, product) {
                chai.request(server)
                    .get('/products.search/fanta?_qFields=name,shortDescription&_select=name,img.main,shortDescription,price,availability&availability=1')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.be.a('array');
                        res.body.data[0].should.have.property('name').eql('Fanta');
                        res.body.data[0].should.have.property('img');
                        res.body.data[0].img.should.have.property('main');
                        res.body.data[0].should.have.property('shortDescription');
                        res.body.data[0].should.have.property('price');
                        res.body.data[0].should.have.property('availability');
                        res.body.data[0].should.not.have.property('longDescription');
                        res.body.data[0].should.not.have.property('stockLevel');
                        res.body.data[0].img.should.not.have.property('imgSet');
                        done();
                    });
            })
        });

        it('it should GET AVAILABLE products by the given keyword "description" which is MATCHED with the shortDescription', function (done) {
            var products = [
                new Product({
                    name: 'Fanta',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/fanta-can-small-183-208-cefd1676.png',
                        imgSet: [
                            'https://i2-prod.mirror.co.uk/incoming/article10431848.ece/ALTERNATES/s810/Fanta.jpg'
                        ]
                    },
                    shortDescription: 'short description 1',
                    longDescription: '',
                    price: 10,
                    availability: true,
                    stockLevel: 10
                }),
                new Product({
                    name: 'Odwalla',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/odwalla-bottle-small-183-208-cff510ee.jpg',
                        imgSet: []
                    },
                    shortDescription: 'Nothing here',
                    longDescription: '',
                    price: 50,
                    availability: false,
                    stockLevel: 0
                })
            ];
            Product.collection.insertMany(products, function (err, product) {
                chai.request(server)
                    .get('/products.search/description?_qFields=name,shortDescription&_select=name,img.main,shortDescription,price,availability&availability=1')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.be.a('array');
                        res.body.data[0].should.have.property('name').eql('Fanta');
                        res.body.data[0].should.have.property('img');
                        res.body.data[0].img.should.have.property('main');
                        res.body.data[0].img.should.not.have.property('imgSet');
                        res.body.data[0].should.have.property('shortDescription');
                        res.body.data[0].should.have.property('price');
                        res.body.data[0].should.have.property('availability');
                        res.body.data[0].should.not.have.property('longDescription');
                        res.body.data[0].should.not.have.property('stockLevel');

                        res.body.should.have.property('meta');
                        res.body.meta.should.be.a('object');
                        res.body.meta.should.have.property('total').eql(1);
                        res.body.meta.should.have.property('skip').eql(null);
                        res.body.meta.should.have.property('limit').eql(null);
                        done();
                    });
            })
        });

        it('it should NOT GET AVAILABLE products by the given keyword "abcd" which is NOT MATCHED with the name and the shortDescription', function (done) {
            var products = [
                new Product({
                    name: 'Fanta',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/fanta-can-small-183-208-cefd1676.png',
                        imgSet: [
                            'https://i2-prod.mirror.co.uk/incoming/article10431848.ece/ALTERNATES/s810/Fanta.jpg'
                        ]
                    },
                    shortDescription: 'short description 1',
                    longDescription: '',
                    price: 10,
                    availability: true,
                    stockLevel: 10
                }),
                new Product({
                    name: 'Odwalla',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/odwalla-bottle-small-183-208-cff510ee.jpg',
                        imgSet: []
                    },
                    shortDescription: 'Nothing here',
                    longDescription: '',
                    price: 50,
                    availability: false,
                    stockLevel: 0
                })
            ];
            Product.collection.insertMany(products, function (err, product) {
                chai.request(server)
                    .get('/products.search/not_available?_qFields=name,shortDescription&_select=name,img.main,shortDescription,price,availability&availability=1')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.be.a('array').eql([]);
                        res.body.meta.should.be.a('object');
                        res.body.meta.should.have.property('total').eql(0);
                        res.body.meta.should.have.property('skip').eql(null);
                        res.body.meta.should.have.property('limit').eql(null);
                        done();
                    });
            })
        });

        it('it should NOT GET UNAVAILABLE products by the given keyword "fanta" which is MATCHED with the name', function (done) {
            var products = [
                new Product({
                    name: 'Odwalla',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/odwalla-bottle-small-183-208-cff510ee.jpg',
                        imgSet: []
                    },
                    shortDescription: 'Short description.',
                    longDescription: 'For over 30 years, Odwalla has been delivering great-tasting nutrition from coast to coast with a full line of 100% juices, smoothies, protein shakes and food bars.  Each one of our products is uniquely crafted with high quality, premium ingredients.  In fact, with over 40 different beverage and bar varieties, our expertise blends together the perfect combination of delicious taste and purposeful nutrition. Personal choices can make a big difference when it comes to taking care of yourself, and at Odwalla, we want you to live life fully, one delicious snack at a time.',
                    price: 50,
                    availability: false,
                    stockLevel: 0
                }),
                new Product({
                    name: 'Unavailable fanta',
                    img: {
                        main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/fanta-can-small-183-208-cefd1676.png',
                        imgSet: [
                            'https://i2-prod.mirror.co.uk/incoming/article10431848.ece/ALTERNATES/s810/Fanta.jpg'
                        ]
                    },
                    shortDescription: 'short description fanta',
                    longDescription: '',
                    price: 10,
                    availability: false,
                    stockLevel: 0
                })
            ];
            Product.collection.insertMany(products, function (err, product) {
                chai.request(server)
                    .get('/products.search/not_available?_qFields=name,shortDescription&_select=name,img.main,shortDescription,price,availability&availability=1')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.should.be.a('array').eql([]);
                        res.body.meta.should.have.property('total').eql(0);
                        res.body.meta.should.have.property('skip').eql(null);
                        res.body.meta.should.have.property('limit').eql(null);
                        done();
                    });
            })
        });
    });
});
