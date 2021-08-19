'use strict';
const zversion = require('../src/Zversion.js');
zversion.update();
zversion.update('minor');
zversion.update('major');
console.log('done!');
