let collections = require('./examples/collections-gee.json');
let processes = require('./examples/processes-gee.json');
let runtimes = require('./examples/udf-runtimes-api.json');
let capabilities = require('./examples/capabilities-api.json');
let fileFormats = require('./examples/file-formats-api.json');
let serviceTypes = require('./examples/service-types-api.json');

module.exports = {
	"Capabilities": {
		"api": {
			"capabilities": capabilities,
			"url": 'https://cool-eo-cloud.com'
		}
	},
	"collections": {
		"gee": {
			"collections": collections
		}
	},
	"collection": {
		"gee": {
			"collection": collections[0]
		}
	},
	"deprecation-notice": {
		"process": {
			"entity": "process"
		}
	},
	"experimental-notice": {
		"process": {
			"entity": "process"
		}
	},
	"file-formats": {
		"api-input": {
			"formats": fileFormats,
			"showInput": true
		},
		"api-output": {
			"formats": fileFormats,
			"showOutput": true
		}
	},
	"process": {
		"gee": {
			"process": processes.find(p => p.id === 'reduce_dimension')
		}
	},
	"processes": {
		"gee": {
			"processes": processes
		}
	},
	"service-types": {
		"api": {
			"services": serviceTypes
		}
	},
	"udf-runtime": {
		"api": {
			"id": "R",
			"data": runtimes["R"]
		}
	},
	"udf-runtimes": {
		"api": {
			"runtimes": runtimes
		}
	}
}