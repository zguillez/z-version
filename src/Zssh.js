'use strict';
require('colors');
const path = require('path');
const prompt = require('prompt');
const shell = require('shelljs');
const SSH = require('node-ssh');
const zfile = require('z-file');
const conn = new SSH();

/**
 *
 * Class Zssh
 */
class Zssh {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Ruta del archivo de configuración
     */
    this.config = path.resolve(__dirname, './ssh.json');
    /**
     * Archivo de configuración
     */
    this.configData = {};
  }

  /**
   * Ruta del fiechero de configuración
   * @param {string} file - Ruta del fichero de configuración
   */
  set config(file) {
    this.constructor.config = path.resolve(__dirname, file);
  }

  /**
   * Ruta del fiechero de configuración
   * @return {string} config - Ruta del fichero de configuración
   */
  get config() {
    return this.constructor.config;
  }

  /**
   * Devuelve true al realizarse la connexión SSH
   * @return {Promise}
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.prompt((config) => {
        conn.dispose();
        conn.connect({
          host: config.host,
          username: config.username,
          password: config.password,
        }).then(() => resolve(true)).catch((err) => reject(err));
      });
    });
  }

  /**
   * Cierra la conexión SSH
   */
  close() {
    conn.dispose();
  }

  /**
   * Ejecuta un commando en el servidor
   * @param command
   * @return {Promise}
   */
  exec(command) {
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        conn.execCommand(command).then((result) => {
          console.log('STDOUT: ' + result.stdout);
          console.log('STDERR: ' + result.stderr);
          resolve(true);
        });
      }).catch((err) => reject(err));
    });
  }

  /**
   * Ejecuta un commando de consola
   * @param command
   * @return {Promise}
   */
  shell(command) {
    return new Promise((resolve, reject) => {
      shell.exec(command);
      resolve(true);
    });
  }

  /**
   * Descarga el directorio remoto en el directorio local
   * @return {Promise}
   */
  download() {
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        conn.exec('cd ' + this.configData.remote + ' && tar -cvf ' + path.resolve(__dirname, '../../../.temp') + '/temp.tar .').then(() => {
          conn.getFile(path.resolve(__dirname, this.configData.local, '../../../../.temp') + '/temp.tar', '/tmp/temp.tar').then(() => {
            conn.exec('rm /tmp/temp.tar').then(() => {
              this.shell('mkdir -p .temp/tar');
              this.shell('tar -xvf .temp/temp.tar -C .temp/tar');
              this.shell('cd .temp/tar/ && mv ./* ' + path.resolve(__dirname, '../../../', this.configData.local) + '/');
              this.shell('rm .temp/temp.tar');
              resolve(true);
            }).catch((err) => {
              reject(err);
            });
          }, (err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => reject(err));
    });
  }

  /**
   * Sube al directorio remoto el directorio local
   * @return {Promise}
   */
  upload() {
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        this.shell('cd ' + path.resolve(__dirname, '../../../', this.configData.local) + '/ && tar -cvf ' + path.resolve(__dirname, '../../../.temp') + '/temp.tar .');
        conn.putFile(path.resolve(__dirname, '../../../.temp') + '/temp.tar', '/tmp/temp.tar').then(() => {
          conn.exec('tar -xvf /tmp/temp.tar -C ' + this.configData.remote + ' && rm /tmp/temp.tar').then(() => {
            this.shell('rm .temp/temp.tar');
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        }, (err) => {
          reject(err);
        });
      }).catch((err) => reject(err));
    });
  }

  /**
   * Genera una consulta desde la consola: host | username | password | folder
   */
  prompt(callback) {
    if (this.configData != {}) {
      const data = {};
      this.checkConfig().then((data) => {
        data = JSON.parse(data);
        this._prompt(data, callback);
      }).catch((err) => {
        // console.log(`${err}`.red);
        this._prompt(data, callback);
      });
    } else {
      this._prompt(this.configData, callback);
    }
  }

  /**
   * Lanza la consulta
   * @param data
   * @param callback
   * @private
   */
  _prompt(data, callback) {
    prompt.start();
    prompt.get(this._promptCreateSchema(data), (err, result) => {
      if (Object.keys(result).length) {
        for (const key in result) {
          data[key] = result[key];
        }
      }
      /**
       * Set data config
       */
      this.configData = data;
      callback(this.configData);
    });
  }

  /**
   * Comprueba los parametros introducidos en el fichero de configuración
   * @param data
   * @return {object} - Objeto schema para el prompt
   * @private
   */
  _promptCreateSchema(data) {
    const schema = {
      properties: {},
    };
    if (!data.host) {
      schema.properties.host = {
        description: `host`.yellow,
        pattern: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        message: 'invalid host format',
        default: data.host,
        required: true,
      };
    }
    if (!data.username) {
      schema.properties.username = {
        description: `username`.yellow,
        pattern: /^\w+$/,
        message: 'invalid username format',
        default: data.username,
        required: true,
      };
    }
    if (!data.password) {
      schema.properties.password = {
        description: `password`.yellow,
        pattern: /^[a-zA-Z0-9]+$/,
        message: 'invalid password format',
        hidden: true,
        required: true,
      };
    }
    if (!data.local) {
      schema.properties.local = {
        description: `local folder`.yellow,
        pattern: /^\w+$/,
        message: 'invalid local folder format',
        default: data.local,
        required: true,
      };
    }
    if (!data.remote) {
      schema.properties.remote = {
        description: `remote folder`.yellow,
        pattern: /^\w+$/,
        message: 'invalid remote folder format',
        default: data.remote,
        required: true,
      };
    }
    return schema;
  }

  /**
   * Comprueba si existe el fichero de configuración
   * @return {Promise}
   */
  checkConfig() {
    return zfile.read(this.config);
  }
}

/**
 *
 * @type {ConnectionSSH}
 */
module.exports = new Zssh();
