const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Datamap } = require('./models');

const router = express.Router();
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/initial/:username', (req, res) => {
    let {username, datamap, locations = []} = req.body;
    return Datamap.create({
        username,
        datamap,
        locations
      }).then(datamap => {
        return res.status(201).json(datamap.apiRepr());
      }).catch(err => {
       console.error(err);
       res.status(500).json({message: 'Internal server error'});
   });
});

router.get('/protected/:username', jwtAuth, (req, res) => {
    let {username} = req.body;
    Datamap
    .findOne(username) //req.body.username
    .then(map => res.status(200).json(map.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

module.exports = {router};