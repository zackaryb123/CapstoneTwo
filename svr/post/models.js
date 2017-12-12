const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    caption: {type: String},
    location: 
    {
        longitude: {type: Number}, //Default get location long
        latitude: {type: Number} // Default get location lat
    },
    date: {type: Date, default: Date.now},
    img: {type: String, required: true},
});

postSchema.virtual('Location').get(function () {
    return `${this.location.longitude} x ${this.location.latitude}`.trim();
});

postSchema.methods.apiRepr = function() {
    return {
        id: this.id,
        title: this.title,
        caption: this.caption,
        location: this.Location,
        date: this.date,
        img: this.img
    };
}

const Post = moongoose.model('Post', postSchema); //name of collection
module.exports = {Post};