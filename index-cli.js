#! /usr/local/bin/node
const zversion = require('./index');
const argv = require('minimist')(process.argv.slice(2));
if (argv.u || argv.update) {
  if (argv.major) {
    zversion.update('major');
  } else if (argv.minor) {
    zversion.update('minor');
  } else {
    zversion.update();
  }
}
