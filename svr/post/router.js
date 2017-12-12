const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Post } = require('./models');

const router = express.Router();
router.use(bodyParse.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
router.get('/', jwtAuth, (req, res) => {
    //GET all pictures 
});

router.get('/:id', jwtAuth, (req, res) => {
    //GET single picture by id 
});

router.post('/upload', jwtAuth, (req, res) => {
    //POST new picture
});

router.put('/update/:id', jwtAuth, (req, res) => {
    //UPDATE picture title, caption, location
});

router.delete('/delete/:id', jwtAuth, (req, res) => {
    //DELETE Post by id
});

router

module.exports = {router};