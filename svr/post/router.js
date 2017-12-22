const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cloudinary = require('cloudinary');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { Post } = require('./models');
const router = express.Router();
router.use(bodyParser.json());
const upload = multer({ dest: './uploads'});

cloudinary.config({
    cloud_name: 'diygdnbei',
    api_key: '754675185139821',
    api_secret: 'N3eXQJDrvrvL_KWGKi1YYRYFrHk'

});

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/protected/:username', jwtAuth, (req, res) => {
    let {username} = req.body;
    Post.find(username)
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
        return res.status(400).send(message);
    } if (!('path' in req.file)) {
        const message = `Missing path in request file`;
        console.error(message);
        return res.status(400).send(message);
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
            created_at: res.created_at,
            bytes: res.bytes,
            url: res.url,
            secure_url: res.secure_url
            })
        }).then(post => {
            console.log('succesfully created');
            res.status(201).json(post.apiRepr());
        }).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

/* router.get('/protected/:id', jwtAuth, (req, res) => {
    Posts
    .find(req.params.id) //check
    .then(post => {
        res.json(post.apiRepr());
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/protected/update/:id', jwtAuth, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }

    const toUpdate = {};
    const updateableFields = ['title', 'caption'];
    updateableFields.forEach(field => {
        if (field in req.body){
            toUpdate[field] = req.body[field];
        }
    });

    Posts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedPost => {
        console.log(`Updating blog post with id \`${req.params.id}\``);
        res.status(204).end();
    }).catch(errr => res.status(500).json({messgae: 'Internal server error'}));
});

router.delete('/protected/delete/:id', jwtAuth, (req, res) => {
    Posts
    .findByIdAndRemove(req.params.id)
    .then(post => {
        console.log(`Deleted blog post with id \`${req.params.id}\``);
         res.status(204).end();
    }).catch(err => res.status(500).json({message: 'Internal server error'}));
}); */

module.exports = {router};