import {Zoom} from './zoom.js';

function Datamap(container) {
    this.container = $(container);
    this.instance = new Datamaps({
    scope: 'world',
    element: this.container.get(0),
    projection: 'mercator',
    done: this._handleMapReady.bind(this)
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new Zoom({
        container: this.container,
        datamap: datamap
    });
};

export {Datamap};