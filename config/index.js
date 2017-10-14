'use strict';


const config        = require('config');
const bunyan        = require('../lib/bunyan');
config.port       = process.env.PORT || config.port;
config.logger     = bunyan.createLogger(config);


module.exports = config;