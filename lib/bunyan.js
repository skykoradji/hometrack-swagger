/* eslint-disable no-unused-vars */
'use strict';

const bunyan     = require('bunyan');


function createLogger(config) {
  let option = {
    name: config.name,
    streams: [{
      'stream': process.stdout,
      'level': 'debug'
    }],
    type: config.env
  };
  return bunyan.createLogger(option);
}

module.exports = {
  createLogger: createLogger
};
