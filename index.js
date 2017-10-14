/* eslint-disable no-console */
'use strict';

const SwaggerExpress = require('swagger-express-mw');
const express        = require('express');
const bodyParser     = require('body-parser');
const config         = require('./config');
const auditLogger    = require('./lib/logger');
let app              = express();
const middleware     = require('./middleware');
const swaggerUi      = require('swagger-ui-express');
const path           = require('path');
const swaggerDoc     = path.normalize(__dirname + '/api/swagger/swagger.yaml');
const YmalJSON       = require('yamljs').load(swaggerDoc);


SwaggerExpress.create({
  appRoot: __dirname
}, function(err, swaggerExpress) {
  if (err) throw err;
  // Need to be set before registering the swagger
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());
  //api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YmalJSON, false));

  app.use(auditLogger(config.logger));

  swaggerExpress.register(app);
  //catch all other routes, get, put, post, del
  app.all('/*', middleware.catchOtherRoutes);
  // Start the WEB server
  let server = app.listen(config.port, () => {
    console.log('API listening on port', config.port);
  });

  app.use(function(err, req, res, next) {
    middleware.errorHandler(err, req, res, server, next);
  });
 
  middleware.gracefulShutdownHandler(server);

});


