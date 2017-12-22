const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DatamapSchema = mongoose.Schema({
    username: {type: String, required: true},
    datamap: {type: Object, required: true},
    locations: {type: Array, default: []}
});

DatamapSchema.methods.apiRepr = function() {
    return {
        username: this.username,
        datamap: this.datamap,
        locations: this.locations || []
    };
}

const Datamap = mongoose.model('Datamap', DatamapSchema); //name of collection
module.exports = {Datamap};