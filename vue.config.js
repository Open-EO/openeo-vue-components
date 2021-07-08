module.exports = {
	publicPath: process.env.CLIENT_URL || '/',
    outputDir: './assets/',
    configureWebpack: {
        devtool: 'source-map',
        entry: './dev/entry.js'
        // ToDo: Load base.scss and utils.js globally, not have it in each chunk
    }
};