'use strict';
const config    = require('./config');
const log       = config.logger;
const _         = require('lodash');
const httpError = require('http-errors');



function gracefulShutdownHandler(server) {
  // listen for TERM signal .e.g. kill 
  process.on('SIGTERM', () => {
    gracefulShutdown(server);
  });

  // listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', () => {
    gracefulShutdown(server);
  });
}

function gracefulShutdown(server) {
  server.close(function() {
    log.info('server close');
    process.exit(1);
  });

  // wait for 5 seconds to shutdown
  setTimeout(function() {
    log.info('forcefully shutting down server after 5seconds');
    process.exit(1);
  }, 5000);
}

function errorHandler(err, req, res, server, next) {
  if(!err) return next();
  res.setHeader('Content-Type', 'application/json');
  //caught http errors
  if(err.status) {
    return res.status(err.status).send({ error: err.message });
  }
  //this is from swagger validation errors
  if(err.message === 'Validation errors') {
    let messages = _.map(err.errors, 'message');
    return res.status(400).send({ message: messages && _.isArray(messages) ? messages[0] : err.errors });
  }
  //caught server exceptions
  log.error({ error: err.stack || err, req: req }, 'caught server exceptions');
  

  return res.status(400).send({ error: err, message: err.stack});
}

function catchOtherRoutes(req, res, next) {
  return next(httpError.NotFound('route_unknown'));
}

module.exports = {
  gracefulShutdownHandler: gracefulShutdownHandler,
  errorHandler: errorHandler,
  catchOtherRoutes: catchOtherRoutes
};