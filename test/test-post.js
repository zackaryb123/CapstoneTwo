'use strict';
global.DATABASE_URL = 'mongodb://localhost/itracku-app-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');
const now = require('date-now');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../svr/users');
const {Post} = require('../svr/post');
const {JWT_SECRET} = require('../svr/config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoint', function() {
  const username = 'username';
  const password = 'password123';
  const firstName = 'First';
  const lastName = 'Last';
  const email = 'example@email.com';
  const avatar = 'img/avatar.png';
  const bio = 'Edit to add personal biography.'

  const public_id = '123abc456def789';
  const title = 'Title';
  const caption = 'Caption';
  const longitude = 33.00;
  const latitude =  -84.00;
  const signature =  'signature';
  const width = 200;
  const height = 200;
  const format = 'png';
  const created_at = Date.now();
  const bytes = 2000;
  const url = 'http://res.cloudinary.com/diygdnbei/image/upload/v1513995404/sample.jpg';
  const secure_url = 'http://res.cloudinary.com/diygdnbei/image/upload/v1513995404/sample.jpg';

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName,
        email,
        bio,
        avatar
      }))
  });

  afterEach(function() {
    return User.deleteOne({username: 'username'})
    .then(Post.remove({username: 'username'}));
  });

  describe('/post/protected/uploads', function() {
    it('Should reject request with no username in request', function() {
      const data = new FormData();
      data.append('title', 'Title-test');
      data.append('caption', 'caption-test');
      data.append('longitude', 33.00);
      data.append('latitude', -84.00);
      data.append('image', './public/img/avatar.png');
      data.append('username', username);
      const token = jwt.sign(
        {
          user: {
            username,
            password,
            firstName,
            lastName,
            email,
            bio,
            avatar
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/post/protected/uploads')
        .type('form')
        .set('authorization', `Bearer ${token}`)
        .send(data)
        .then(function() { 
          expect.fail(null, null, 'Request should fail');
        }).catch(function (err) {
            if( err instanceof chai.AssertionError) {
            throw err;
        }
        const res = err.response;
        expect(res).to.have.status(422);
      });
    });
  });

  
  describe('/post/protected/uploads', function() {
    it('Should reject requests with no file path', function() {
      const data = new FormData();
      data.append('title', 'Title-test');
      data.append('caption', 'caption-test');
      data.append('longitude', 33.00);
      data.append('latitude', -84.00);
      data.append('username', username);
      const token = jwt.sign(
        {
          user: {
            username,
            password,
            firstName,
            lastName,
            email,
            bio,
            avatar
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/post/protected/uploads')
        .query({username: username})
        .type('form')
        .set('authorization', `Bearer ${token}`)
        .send(data)
        .then(function(){
          expect.fail(null, null, 'Request should not succeed')
        })
        .catch(function(err) {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(422);
        });
    });
  });
});