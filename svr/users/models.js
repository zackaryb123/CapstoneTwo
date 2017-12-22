'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  bio: {type: String, default: 'Edit to add personal biography.'},
  avatar: {type: String, default: "img/avatar.png"}
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    bio: this.bio || 'Edit to add personal biography.',
    avatar: this.avatar || 'img/avatar.png'
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema); //Name of the collection

module.exports = {User};