if (process.env.JM_LANG === 'ES6') {
    console.log('run test on ES6 version');
    module.exports = require('../es6/jsmind');
} else {
    console.log('run test on ES5 version');
    module.exports = require('../js/jsmind');
}
