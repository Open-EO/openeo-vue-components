let collections = require('./examples/collections-gee.json');
let processes = require('./examples/processes-gee.json');
let runtimes = require('./examples/udf-runtimes-api.json');

module.exports = {
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