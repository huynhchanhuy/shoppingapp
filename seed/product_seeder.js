/**
 * Created by Huy on 13/01/2018.
 */
var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uri = 'mongodb://remote_user:Huy123456@ds153577.mlab.com:53577/shopping_app_db';
//var uri = 'mongodb://ds153577.mlab.com:53577/shopping_app_db';
mongoose.connect(uri, {
    useMongoClient: true
});

var products = [
    new Product({
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
    }),
    new Product({
        name: 'Diet Coke',
        img: {
            main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/diet-coke-bottle-small-183-208-cee60eb7.png',
            imgSet: [
                'https://images-na.ssl-images-amazon.com/images/I/41Fsf7xRr8L._SX385_.jpg',
                'http://smokezonefl.com/wp-content/uploads/2017/05/sta21.jpg'
            ]
        },
        shortDescription: 'Diet Coke, also known as Coca-Cola light in some markets, is a sugar- and calorie-free soft drink.',
        longDescription: 'Diet Coke, also known as Coca-Cola light in some markets, is a sugar- and calorie-free soft drink. It was first introduced in the United States on August 9, 1982, as the first new brand since 1886 to use the Coca-Cola Trademark. Today, Diet Coke/Coca-Cola light is one of the largest and most successful brands of The Coca-Cola Company, available in more than 150 markets around the world.',
        price: 2,
        availability: true,
        stockLevel: 10
    }),
    new Product({
        name: 'Sprite',
        img: {
            main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/sprite-can-small-183-208-cee7b584.png',
            imgSet: [
                'https://cdn.grofers.com/app/images/products/full_screen/pro_312.jpg'
            ],
        },
        shortDescription: 'Introduced in 1961, Sprite is the world\'s leading lemon-lime flavored soft drink.',
        longDescription: 'Introduced in 1961, Sprite is the world\'s leading lemon-lime flavored soft drink. It has a crisp, clean taste that really quenches your thirst.',
        price: 5,
        availability: true,
        stockLevel: 10
    }),
    new Product({
        name: 'Fanta',
        img: {
            main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/fanta-can-small-183-208-cefd1676.png',
            imgSet: [
                'https://i2-prod.mirror.co.uk/incoming/article10431848.ece/ALTERNATES/s810/Fanta.jpg'
            ],
        },
        shortDescription: 'Introduced in 1940, Fanta is the second oldest brand of The Coca-Cola Company and our second largest brand outside the US.',
        longDescription: 'Introduced in 1940, Fanta is the second oldest brand of The Coca-Cola Company and our second largest brand outside the US. Fanta Orange is the leading flavor but almost every fruit grown is available as a Fanta flavor somewhere.  Consumed more than 130 million times every day around the world, consumers love Fanta for its great, fruity taste.',
        price: 10,
        availability: true,
        stockLevel: 10
    }),
    new Product({
        name: 'Mello Yello',
        img: {
            main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/mello-yello-small-can-183-208-cfe5ae14.png',
            imgSet: [
                'https://images-na.ssl-images-amazon.com/images/I/61EXFuww-DL._SY450_.jpg'
            ]
        },
        shortDescription: 'The smooth citrus taste of Mello Yello has refreshed people\'s thirst for over two decades.',
        longDescription: 'The smooth citrus taste of Mello Yello has refreshed people\'s thirst for over two decades. Its unique taste and confident, in-control style sets it apart from other soft drinks. Mello Yello highlights the smooth choices in life - because when you drink Mello Yello, everything goes down easy.',
        price: 20,
        availability: true,
        stockLevel: 10
    }),
    new Product({
        name: 'Odwalla',
        img: {
            main: 'http://www.coca-colacompany.com/content/dam/journey/us/en/global/2012/11/odwalla-bottle-small-183-208-cff510ee.jpg',
            imgSet: [],
        },
        shortDescription: 'For over 30 years, Odwalla has been delivering great-tasting nutrition from coast to coast with a full line of 100% juices, smoothies, protein shakes and food bars.',
        longDescription: 'For over 30 years, Odwalla has been delivering great-tasting nutrition from coast to coast with a full line of 100% juices, smoothies, protein shakes and food bars.  Each one of our products is uniquely crafted with high quality, premium ingredients.  In fact, with over 40 different beverage and bar varieties, our expertise blends together the perfect combination of delicious taste and purposeful nutrition. Personal choices can make a big difference when it comes to taking care of yourself, and at Odwalla, we want you to live life fully, one delicious snack at a time.',
        price: 50,
        availability: false,
        stockLevel: 0
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    console.log('Insert product: ' + products[i].name);
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            console.log('Done.');
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
