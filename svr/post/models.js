const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PostSchema = mongoose.Schema({
    public_id: {type: String}, //required
    username: {type: String},
    title: {type: String},
    caption: {type: String},
    longitude: {type: Number},
    latitude: {type: Number},
    signature: {type: String},
    width: {type: Number},
    height: {type: String},
    format: {type: String},
    created_at: {type: Date},
    bytes: {type: Number},
    url: {type: String}, //required
    secure_url: {type: String} //required
});

PostSchema.methods.apiRepr = function() {
    return {
        public_id: this.public_id,
        title: this.title,
        username: this.username,
        caption: this.caption,
        longitude: this.longitude,
        latitude: this.latitude,
        //signature: this.signature,
        //width: this.width,
        //height: this.height,
        //format: this.format,
        created_at: this.created_at,
        // bytes: this.bytes,
        url: this.url, //required
        secure_url: this.secure_url
    };
}

const Post = mongoose.model('Post', PostSchema);
module.exports = {Post};