const path = require('path');

module.exports = {
    entry: [
        './_dist/ajax/index.js',
        './_dist/navigation/nav.js',
        './_dist/map/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty",
        module: "empty",
        dns: "empty", 
     }
};