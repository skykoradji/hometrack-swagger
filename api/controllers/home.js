'use strict';



const httpError = require('http-errors');
const _         = require('lodash');

function track(req, res, next) {

  let payload  = req.swagger.params.payload.value;
  let type     = req.swagger.params.type.value;
  let workflow = req.swagger.params.workflow.value;

  try {
    payload = JSON.parse(payload);
  } catch (e) {
    return next(httpError.BadRequest('Could not decode request: JSON parsing failed'));
  }

  let filter = _.filter(payload, function(item) {
    return item.type === type && item.workflow === workflow;
  });
  let response = [];
  _.each(filter, function(item, index) {
    let address = filter[index].address;
    response.push({
      concataddress: [address.unitNumber, address.buildingNumber, address.street, address.suburb, address.state, address.postcode].join(' ').trim(),
      type: item.type,
      workflow: item.workflow
    });
  });

  res.json({ response: response });
}

module.exports = {
  track: track
};