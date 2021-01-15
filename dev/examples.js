let collections = require('./examples/collections-gee.json');
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
			"collection": collections[0]
		}
	},
	"collections": {
		"gee": {
			"collections": collections
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

~Strikethrough~

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
			"format": fileFormats.output.GTIFF,
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
			"showOutput": false
		},
		"api-output": {
			"formats": fileFormats,
			"showInput": false
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
			"headingTag": "h3",
			"ignoreRel": ['self', 'conformance']
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
	// ToDo: SearchableList
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
	// ToDo: Tab, Tabs
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