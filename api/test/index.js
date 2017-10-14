'use strict';
const should  = require('should');
const request = require('supertest');
const helper  = require('./helper');
const _       = require('lodash');


describe('Check request', function() {

  it('405 Method not allow', function(done) {
    request(helper.host)
      .get('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: 'abcdef',
        type: 'htv',
        workflow: 'completed'
      })
      .expect(405)
      .expect('Content-Type', /json/)
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });

  it('400 Bad request', function(done) {
    request(helper.host)
      .post('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: 'abcdef',
        type: 'htv',
        workflow: 'completed'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        let result = JSON.parse(res.text);
        result.should.be.type('object');
        should.exist(result.error);
        result.error.should.be.equal('Could not decode request: JSON parsing failed');
        done();
      });
  });

  it('200 OK with request', function(done) {
    request(helper.host)
      .post('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: JSON.stringify(helper.request.payload),
        type: 'htv',
        workflow: 'completed'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        results.should.be.type('object');
        should.exist(results.response);
        results.response.length.should.be.equal(2);
        _.each(results.response, function(item, index) {
          should.exist(item.concataddress);
          should.exist(item.type);
          should.exist(item.workflow);
          if (index === 0) item.concataddress.should.be.equal('Level 6 146 Arthur Street North Sydney NSW 2060');
          if (index === 1) item.concataddress.should.be.equal('Level 28 360 Elizabeth St Melbourne VIC 3000');
          item.type.should.be.equal('htv');
          item.workflow.should.be.equal('completed');
        });
        done();
      });
  });

  it('200 OK with request', function(done) {
    request(helper.host)
      .post('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: JSON.stringify(helper.request.payload),
        type: 'avm',
        workflow: 'cancelled'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        results.should.be.type('object');
        should.exist(results.response);
        results.response.length.should.be.equal(1);
        _.each(results.response, function(item, index) {
          should.exist(item.concataddress);
          should.exist(item.type);
          should.exist(item.workflow);
          if (index === 0) item.concataddress.should.be.equal('Suite 1 Level 8 92 Pitt Street Sydney NSW 2000');
          item.type.should.be.equal('avm');
          item.workflow.should.be.equal('cancelled');
        });
        done();
      });
  }); 

  it('200 OK with default type: htv workflow: completed request', function(done) {
    request(helper.host)
      .post('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: JSON.stringify(helper.request.payload)
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        results.should.be.type('object');
        should.exist(results.response);
        results.response.length.should.be.equal(2);
        _.each(results.response, function(item, index) {
          should.exist(item.concataddress);
          should.exist(item.type);
          should.exist(item.workflow);
          if (index === 0) item.concataddress.should.be.equal('Level 6 146 Arthur Street North Sydney NSW 2060');
          if (index === 1) item.concataddress.should.be.equal('Level 28 360 Elizabeth St Melbourne VIC 3000');
          item.type.should.be.equal('htv');
          item.workflow.should.be.equal('completed');
        });
        done();
      });
  }); 

  it('200 OK with unknown type', function(done) {
    request(helper.host)
      .post('/')
      .set('Accept', 'application/json')
      .type('form')
      .send({
        payload: JSON.stringify(helper.request.payload),
        type: 'abcd',
        workflow: 'cancelled'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        let results = JSON.parse(res.text);
        results.should.be.type('object');
        should.exist(results.response);
        results.response.length.should.be.equal(0);
        done();
      });
  }); 
});