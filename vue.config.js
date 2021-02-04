module.exports = {
    outputDir: './assets/',
    // Make relativ paths so that they can be deployed in any folder
    publicPath: '',
    // Inline CSS into JS, don't export separate CSS files
    css: {
        extract: false
    },
    configureWebpack: {
        devtool: 'source-map',
        entry: './dev/entry.js'
    }
};