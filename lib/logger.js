'use strict';

const httpError = require('http-errors');
const uuid      = require('uuid');
const ip        = require('ip');


/**
 * add customized logger for syndication, 
 * Reference from https://github.com/restify/node-restify/blob/ac13902ad9716dcb20aaa62295403983075b1841/lib/plugins/audit.js#L38-L87
 * @param  {[type]} logger [description]
 * @return {[type]}        [description]
 */
function auditLogger(logger) {
  let log = logger.child({
    audit: true,
    serializers: {
      req: function auditRequestSerializer(req) {
        if (!req) {
          return (false);
        }

        return ({
          // account for native and queryParser plugin usage
          query: (typeof req.query === 'function') ? req.query() : req.query,
          method: req.method,
          url: req.url,
          headers: req.headers,
          httpVersion: req.httpVersion,
          trailers: req.trailers,
          body: req.body || undefined,
          clientClosed: req.clientClosed
        });
      },
      res: function auditResponseSerializer(res) {
        if (!res) {
          return (false);
        }

        var body;
        if (res._body instanceof httpError) {
          body = res._body.body;
        } else {
          body = res._body;
        }
        return ({
          statusCode: res.statusCode,
          headers: res._headers,
          trailer: res._trailer || false,
          body: body
        });
      }
    }
  });

  function audit(req, res, next) {

    let startTime = process.hrtime();
    res.on('finish', function() {
      logging(req, res, startTime);
    });
    res.on('close', function() {
      logging(req, res, startTime);
    });
    return next();
  }

  function logging(req, res, startTime) {

    let hrtime = process.hrtime(startTime);
    let latency = hrtime[0] * 1e3 + hrtime[1] / 1e6;


    let obj = {
      remoteAddress: ip.address(),
      remotePort: req.connection.remotePort,
      req_id: uuid.v4(),
      req: req,
      res: res,
      latency: latency,
      secure: req.secure
    };

    log.info(obj, 'handled: %d', res.statusCode);
  }
  return (audit);
}


///-- Exports

module.exports = auditLogger;