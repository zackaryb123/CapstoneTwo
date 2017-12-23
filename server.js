'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./svr/config');
const { router: usersRouter } = require('./svr/users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./svr/auth');
const { router: postRouter } = require('./svr/post');
const { router: mapRouter } = require('./svr/map');

mongoose.Promise = global.Promise;

//Init App
const app = express();

// Logging
app.use(morgan('dev'));

//CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.status(204);
    }
    next();
});

//Link public files 
app.use(express.static(path.join(__dirname, 'public')));

//Add middleware strategies to passport 
passport.use(localStrategy);
passport.use(jwtStrategy);

//Use Routers
app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/post/', postRouter);
app.use('/map/', mapRouter);

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer() {
    return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
        if (err) {
        return reject(err);
        }
        server = app
        .listen(PORT, () => {
            console.log(`Your app is listening on port ${PORT}`);
            resolve();
        })
        .on('error', err => {
            mongoose.disconnect();
            reject(err);
        });
    });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
        if (err) {
            return reject(err);
        }
        resolve();
        });
    });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };