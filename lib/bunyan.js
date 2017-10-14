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
  if(config.env === 'production') {
    //dump the file to local if it is production
    option.streams =  [{
        path: `${process.env.HOME}/hometrack.log`
        // `type: 'file'` is implied
    }];
  }
  return bunyan.createLogger(option);
}

module.exports = {
  createLogger: createLogger
};
