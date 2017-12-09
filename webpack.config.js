const path = require('path');

module.exports = {
    entry: [
        './_dist/js/nav.js',
        './_dist/map/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '_dist')
    }
};