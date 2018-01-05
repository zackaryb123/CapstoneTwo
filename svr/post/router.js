const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cloudinary = require('cloudinary');
const multer = require('multer');
const moment = require('moment');

const { Post } = require('./models');
const router = express.Router();
router.use(bodyParser.json());
// need to figure out how to clear local ./uploads after file has been uploaded to cloudinary
const upload = multer({ dest: './svr/post/uploads'}); 

cloudinary.config({
    cloud_name: 'diygdnbei',
    api_key: '754675185139821',
    api_secret: 'N3eXQJDrvrvL_KWGKi1YYRYFrHk'

});

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/protected/:username', jwtAuth, (req, res) => {
    let {username} = req.params;
    Post.find({username: username})
        .then(posts => 
            res.json(posts.map((post) => post.apiRepr()))
        ).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
    });

router.post('/protected/uploads', [jwtAuth, upload.single('image')], (req, res) => {
    if (!('username' in req.body)) {
        const message = `Missing username in request body`;
        console.error(message);
        return res.status(422).send(message);
    } if (!('path' in req.file)) {
        const message = `Missing path in request file`;
        console.error(message);
        return res.status(422).send(message);
    }

    cloudinary.v2.uploader.upload(req.file.path, 
        {tags: [req.body.title, req.body.caption, req.body.username,
            req.body.longitude, req.body.latitude]}
    ).then(function(res) {
        return Post
        .create({
            public_id: res.public_id,
            signature: res.signature,
            username: res.tags[2],
            title: res.tags[0],
            caption: res.tags[1],
            longitude: res.tags[3],
            latitude: res.tags[4],
            width: res.width,
            height: res.height,
            format: res.format,
            created_at: moment().format('MMMM Do YYYY'), //res.created_at,
            bytes: res.bytes,
            url: res.url,
            secure_url: res.secure_url
            })
        }).then(post => {
            console.log('successfully created');
            res.status(201).json(post.apiRepr());
        }).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.delete('/protected/delete/:public_id', jwtAuth, (req, res) => {
    cloudinary.v2.uploader.destroy(`${req.params.public_id}`);

    return Post
        .remove({public_id: req.params.public_id})
        .then(suc => {
            console.log(`Deleted blog post with id \`${req.params.public_id}\``);
            res.status(204).end();
        }).catch(err => {
            res.status(500).json({message: 'Internal server error'});
        });
});

module.exports = {router};