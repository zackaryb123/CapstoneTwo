import {Zoom} from './zoom.js';

function Datamap() {
    this.container = $('#worldMapView');
    this.instance = new Datamaps({
        scope: 'world',
        element: this.container.get(0),
        projection: 'mercator',
        done: this._handleMapReady.bind(this)
        // fills: {
        //     defaultFill: '#4CAF50',
        //     'bubble': 'red'
        // },
        // data: {
        //     'bubble': {fillKey: 'bubble'}
        // }
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new Zoom({
        container: this.container,
        datamap: datamap
    });
};

export {Datamap};