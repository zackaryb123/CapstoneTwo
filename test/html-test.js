'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

chai.should();

chai.use(chaiHttp);

describe('GET index page', function() {
  it('Should exist', function() {
    return chai.request(app)
      .get('/')
      .then(function (yes) {
        expect(res).to.have.status(200);
      });
  });
}); 