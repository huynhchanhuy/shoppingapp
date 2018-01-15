/**
 * Created by Huy on 15/01/2018.
 */

if (process.env.NODE_ENV === 'test') {
    console.info('Loading \"test.json\". Test environment has been started.');
    module.exports = require('./../test.json');
} else {
    console.info('Loading \"dev.json\". Dev environment has been started.');
    module.exports = require('./../dev.json');
}

