'use strict';
require('colors');
const path = require('path');
const fs = require('fs');
const replace = require('replace');

/**
 *
 * Class Zversion
 */
class Zversion {
  /**
   * Update de package version
   */
  update(level) {
    this.file = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'));
    this.version = this.file.version.split('.');
    if (level === 'major') {
      this.version[0] = Number(this.version[0]) + 1;
      this.version[1] = 0;
      this.version[2] = 0;
    } else if (level === 'minor') {
      this.version[1] = Number(this.version[1]) + 1;
      this.version[2] = 0;
    } else {
      this.version[2] = Number(this.version[2]) + 1;
    }
    /* istanbul ignore next */
    replace({
      regex: `"version": "${this.file.version}"`,
      replacement: `"version": "${this.version.join('.')}"`,
      paths: [path.resolve('./package.json')],
      silent: true,
    });
    console.log(`=> Package update from version`.green, `${this.file.version}`.yellow, `to`.green, `${this.version.join('.')}`.yellow);
  }
}

/**
 *
 * @type {Zversion}
 */
module.exports = new Zversion();
