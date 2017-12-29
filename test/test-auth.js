'use strict';
global.DATABASE_URL = 'mongodb://localhost/itracku-app-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../svr/users');
const { JWT_SECRET } = require('../svr/config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Register endpoint', function() {
  const username = 'username';
  const firstName = 'First';
  const lastName = 'Last';
  const email = 'example@email.com';
  const password = 'password123';
  const password2 = 'password123';
  const avatar = 'img/avatar.png';
  const bio = 'Edit to add personal biography.'

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  afterEach(function () {
    return User.remove({username: 'username'});
  });

  describe('users/register', function (){
    it('Should reject request with missing field', function(){
      return chai
        .request(app)
        .post('/users/register')
        .then(function() {
          expect.fail(null, null, 'Request should not succeed')
        }).catch(function(err){
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(422);
        });
    });

    it('Should reject if passwords dont match', function() {
      return chai
      .request(app)
      .post('/users/register')
      .send({username, firstName, lastName, email, password: 'password123', password2: 'password321'})        
      .then(function() {
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

    it('Should reject if password is not length of atleast 10', function() {
      return chai.request(app)
      .post('/users/register')
      .send({username, firstName, lastName, email, password: 'pass123', password2: 'pass123'})
      .then(function() {
        expect.fail(null, null, 'Request should not succeed')
      }).catch(function(err) {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(422);
      });
    });

    it('Should return json data submited to the server', function () {
      return chai
      .request(app)
      .post('/users/register')
      .send({username, firstName, lastName, email, password, password2})
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.deep.equal({username, firstName, lastName, email, bio, avatar});
      });
    });
  });
});

describe('Auth endpoints', function () {
  const username = 'username';
  const password = 'password123';
  const firstName = 'First';
  const lastName = 'Last';
  const email = 'example@email.com';
  const avatar = 'img/avatar.png';
  const bio = 'Edit to add personal biography.'

  before(function () {
    return runServer();
  });

  after(function () {
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
      })
    );
  });

  afterEach(function () {
    return User.deleteOne({username: 'username'});
  });

  describe('/auth/login', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .then(function() {
          expect.fail(null, null, 'Request should not succeed')
        }).catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(400);
        });
    });
    it('Should reject requests with incorrect usernames', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username: 'wrongUsername', password })        
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password: 'wrongPassword' })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password})
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({username, firstName, lastName, email, bio, avatar});
        });
    });
  });

  describe('/auth/refresh', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/auth/refresh')
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          username
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            username
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .post('/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: {
            username
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post('/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            username
          });
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
