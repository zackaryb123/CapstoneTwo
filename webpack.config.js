const path = require('path');

module.exports = {
    entry: [
        './_dist/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
};