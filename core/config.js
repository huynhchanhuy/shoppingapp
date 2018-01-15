/**
 * Created by Huy on 15/01/2018.
 */

if (process.env.NODE_ENV === 'test') {
    console.log('Test Environement');
    module.exports = require('./../.env.test.json');
} else {
    console.log('Dev Environement');
    module.exports = require('./../.env.json');
}

