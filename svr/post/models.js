const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PostSchema = mongoose.Schema({
    public_id: {type: String, required: true},
    username: {type: String, required: true},
    title: {type: String},
    caption: {type: String},
    longitude: {type: Number, default: null},
    latitude: {type: Number, default: null},
    radius: {type: Number, default: 10},
    fillKey: {type: String, default: 'bubble'},
    signature: {type: String},
    width: {type: Number},
    height: {type: String},
    format: {type: String},
    created_at: {type: String},
    bytes: {type: Number},
    url: {type: String, required: true},
    secure_url: {type: String, required: true}
});

PostSchema.methods.apiRepr = function() {
    return {
        public_id: this.public_id,
        title: this.title,
        username: this.username,
        caption: this.caption,
        longitude: this.longitude,
        latitude: this.latitude,
        radius: this.radius || 10,
        fillKey: this.fillKey || 'bubble',
        created_at: this.created_at,
        url: this.url, 
        secure_url: this.secure_url
    };
}

const Post = mongoose.model('Post', PostSchema);
module.exports = {Post};