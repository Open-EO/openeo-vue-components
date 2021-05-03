let collection = require('./examples/collection-gee-s2.json');
let collections = require('./examples/collections-gee.json');
let item = require('./examples/item.json');
let items = require('./examples/items-ard-eodc.json');
let job = require('./examples/job.json');
let processes = require('./examples/processes-gee.json');
let runtimes = require('./examples/udf-runtimes-api.json');
let capabilities = require('./examples/capabilities-api.json');
let fileFormats = require('./examples/file-formats-api.json');
let serviceTypes = require('./examples/service-types-api.json');
let reduceApi = require('./examples/reduce-api-new.json');
let longArray = [...Array(1000).keys()];

module.exports = {
	"billing-plans": {
		"api": {
			"billing": capabilities.billing
		}
	},
	"capabilities": {
		"api": {
			"capabilities": capabilities,
			"url": 'https://cool-eo-cloud.com'
		}
	},
	"collection": {
		"gee": {
			"data": collection
		}
	},
	"collections": {
		"gee": {
			"collections": collections
		},
		"collapsed": {
			"collections": collections,
			"collapsed": true
		},
		"expanded-but-collapsible": {
			"collections": collections,
			"collapsed": false
		}
	},
	"data-table": {
		"jobs": {
			"data": [
				{"id":"mrzFnnApHC0rwxJu","title":"Another Job","description":null,"status":"finished","created":"2020-11-17T12:42:54Z","updated":"2020-11-17T14:22:24Z","plan":"free","costs":0,"budget":null},
				{"id":"1324657890","title":"Second Job","description":"A test!","status":"submitted","created":"2020-11-18T14:00:12+01:00","updated":"2020-11-18T14:00:12+01:00"}
			],
			"columns": {
				id: {
					name: 'ID',
					primaryKey: true
				},
				title: {
					name: 'Title'
				},
				status: {
					name: 'Status',
					stylable: true
				},
				created: {
					name: 'Submitted',
					format: 'Timestamp',
					sort: 'desc'
				},
				updated: {
					name: 'Last update',
					format: 'Timestamp'
				}
			}
		}
	},
	"deprecation-notice": {
		"process": {
			"entity": "process"
		}
	},
	"description": {
		"general": {
			"description": `
# H1

Normal text and \`code\`

## H2

**Bold**

No HTML:

<hr>

### H3

*Italic*

> Blockquote

#### H4

\`\`\`js
if (a == b) console.log("Hello World");
\`\`\`

##### H5 

[Link](http://a.com)

###### H6

![Image](https://commonmark.org/help/images/favicon.png)

* Unordered List
* Foo
* Bar

---

1. Ordered List
2. X
3. Y
`
		}	
	},
	"experimental-notice": {
		"process": {
			"entity": "process"
		}
	},
	"file-format": {
		"output-gtiff": {
			"id": "GTIFF",
			"format": fileFormats.output.GTiff,
			"type": "output"
		},
		"output-gpkg": {
			"id": "GPKG",
			"format": fileFormats.output.GPKG,
			"type": "output"
		},
		"input-gpkg": {
			"id": "GPKG",
			"format": fileFormats.input.GPKG,
			"type": "input"
		}
	},
	"file-formats": {
		"api-all": {
			"formats": fileFormats
		},
		"api-input": {
			"formats": fileFormats,
			"show-output": false
		},
		"api-output": {
			"formats": fileFormats,
			"show-input": false
		}
	},
	"item": {
		"batch-job": {
			"data": item
		}
	},
	"items": {
		"ard-eodc": {
			"items": items,
			"show-map": true
		}
	},
	"job": {
		"example": {
			"job": job,
			"currency": "EUR"
		}
	},
	"json-schema": {
		"callback": {
			"schema": reduceApi.parameters[1].schema
		}
	},
	"link-list": {
		"gee-capabilities-links": {
			"links": capabilities.links,
			"heading": "Google Earth Engine Links",
			"heading-tag": "h1",
			"ignore-rel": ['self', 'conformance']
		}
	},
	"object-tree": {
		"array": {
			"data": collections
		},
		"object": {
			"data": capabilities
		},
		"scalar": {
			"data": 1000
		},
		"md-array": {
			"data": [longArray,longArray,longArray,longArray,longArray,longArray,longArray]
		}
	},
	"process": {
		"gee-load-collection": {
			"process": processes.find(p => p.id === 'load_collection')
		},
		"api-reduce-new": {
			"process": reduceApi
		}
	},
	"processes": {
		"gee": {
			"processes": processes
		}
	},
	// ToDo: SearchableList - see other implementing components for examples, e.g. Collections or Processes
	"searchable-list": {
		"empty": {}
	},
	"service-type": {
		"wms": {
			"id": "WMS",
			"service": serviceTypes.WMS
		},
		"ogcapi-features": {
			"id": "OGCAPI-FEATURES",
			"service": serviceTypes['OGCAPI-FEATURES']
		}
	},
	"service-types": {
		"api": {
			"services": serviceTypes
		}
	},
	"supported-features": {
		"api": {
			"endpoints": capabilities.endpoints
		}
	},
	// ToDo: Tab, Tabs - see UdfRuntime component for an example
	"udf-runtime": {
		"api": {
			"id": "R",
			"runtime": runtimes["R"]
		}
	},
	"udf-runtimes": {
		"api": {
			"runtimes": runtimes
		}
	}
}