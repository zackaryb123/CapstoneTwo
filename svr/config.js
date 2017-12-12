'use strict';
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/itracku-app'; //Name of DB
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'zackaryb123';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';