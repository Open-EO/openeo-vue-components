module.exports = {
	outputDir: './assets/',
    configureWebpack: {
        externals: {
			// We don't include ajv as the library is only used for process graph parsing etc, but we don't need this currently in vue-components
            ajv: 'ajv'
        }
    }
};