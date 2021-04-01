module.exports = {
	publicPath: process.env.CLIENT_URL || '/',
    outputDir: './assets/',
    configureWebpack: {
        devtool: 'source-map',
        entry: './dev/entry.js',
        externals: {
            // We don't include ajv as the library is only used for process graph parsing etc, but we don't need this currently in vue-components
            ajv: 'ajv'
        }
        // ToDo: Load base.css and utils.js globally, not have it in each chunk
    }
};