'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cloudinary = require('cloudinary');
const multer = require('multer');
const {User} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.use(jsonParser); //removed middleware jsonParser from post and made router use 
const upload = multer({ dest: './svr/users/avatars'});

cloudinary.config({
    cloud_name: 'diygdnbei',
    api_key: '754675185139821',
    api_secret: 'N3eXQJDrvrvL_KWGKi1YYRYFrHk'

});

router.post('/register', (req, res) => {
  const requiredFields = ["username", 'password', 'firstName', 'lastName', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'email', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  const explicityTrimmedFields = ['username', 'password', 'email'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const nonMatchingPasswords = req.body.password !== req.body.password2;
  
  if (nonMatchingPasswords){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Passwords must match',
      location: nonMatchingPasswords
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, email, firstName, lastName, bio = 'Edit to add personal biography.', 
  avatar = "img/avatar.png"} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        email,
        bio,
        avatar
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.get('/protected/:username', jwtAuth, (req, res) => {
  return User
    .findOne(req.body.username)
    .then(user => res.json(user.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
  });
});

router.put('/protected/:username', [jwtAuth, upload.single('avatar')], (req, res) => {
    // if (!(req.params.username && req.body.username && req.params.username === req.body.username)) {
    //     const message = (
    //         `Request path id (${req.params.username}) and request body id (${req.body.username}) must match`);
    //     console.error(message);
    //     return res.status(400).send(message);
    // }

    let {bio = 'Edit to add personal biography.'} = req.body;
    if ('file' in req) {
        cloudinary.v2.uploader.upload(req.file.path,
            {tags: [bio]})
            .then(function (res) {
                return User
                    .findOneAndUpdate(req.params.username,
                        {'avatar': res.secure_url,
                        'bio': res.tags[0]},
                        {new: true})
                    .then(updatedPost => {
                        console.log(updatedPost);
                        console.log(`Updating profile for \`${req.params.username}\``);
                        res.status(204).json(updatedPost.apiRepr());
                    }).catch(errr => res.status(500).json({messgae: 'Internal server error'}));
            });
    } else {
        return User
            .findOneAndUpdate(req.params.username,
                {'bio': bio},
                {new: true})
            .then(updatedPost => {
                console.log(updatedPost);
                console.log(`Updating profile for \`${req.params.username}\``);
                res.status(204).json(updatedPost.apiRepr());
            }).catch(errr => res.status(500).json({messgae: 'Internal server error'}));
    }
});

module.exports = {router};
