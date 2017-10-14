'use strict';


const request = require('./request');
const config  = require('../../../config');

module.exports = {
  host: 'localhost:' + config.port,
  request: request
};

