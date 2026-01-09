let collectionGee = require('./examples/collection-gee-s2.json');
let collectionEurac = require('./examples/collection-eurac.json');
let collections = require('./examples/collections-gee.json');
let item = require('./examples/item.json');
let itemCeos = require('./examples/item-ceos.json');
let items = require('./examples/items-ard-eodc.json');
let job = require('./examples/job.json');
let logs = require('./examples/logs.json');
let processes = require('./examples/processes.json');
let udp = require('./examples/process-array-find-nodata.json');
let runtimes = require('./examples/udf-runtimes-api.json');
let capabilities = require('./examples/capabilities-api.json');
let fileFormatsApi = require('./examples/file-formats-api.json');
let fileFormatsVito = require('./examples/file-formats-vito.json');
let serviceTypes = require('./examples/service-types-api.json');
let service = require('./examples/service.json');
let reduceApi = require('./examples/reduce-api-new.json');
let table = require('./examples/table.json');
let ppVito = require('./examples/processing-parameters-vito.json');
let ppApi = require('./examples/processing-parameters-api.json');
let longArray = [...Array(1000).keys()];

let mbSample = require('./examples/model-builder/sample.json');
let maskScl = require('./examples/model-builder/mask_scl_dilation.json');
let clip = require('./examples/model-builder/clip.json');
let ardSR = require('./examples/model-builder/ard_surface_reflectance.json');
let slow = require('./examples/model-builder/slow.json');
let externalProc = require('./examples/model-builder/external_process.json');

let asyncFn = () => new Promise(resolve => setTimeout(() => {
	alert("Async action executed");
	resolve();
}, 3000));

module.exports = {
	"b-button": {
		"example": {
			"title": "This is a test tooltip!",
			"text": "i"
		}
	},
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
			"data": collectionGee
		},
		"eurac-mapbox": {
			"data": collectionEurac,
			"mapOptions": {
				"basemap": "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3BlbmVvIiwiYSI6ImNreDRzdjNibDE5a2cyd3BoOXFyamd2ZTcifQ._epD9HcfAnGndfgwXmz_3A",
				"attribution": '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
			},
			"federation": capabilities.federation
		}
	},
	"collections": {
		"gee": {
			"collections": collections,
			"federation": capabilities.federation,
			"deprecated-filter": true,
			"hide-deprecated": true
		},
		"collapsed": {
			"collections": collections,
			"collapsed": true
		},
		"expanded-but-collapsible-with-keywords": {
			"collections": collections,
			"collapsed": false,
			"show-keywords": true,
			"missing": ["wwu"],
			"federation": capabilities.federation
		}
	},
	"data-table": {
		"jobs": {
			"data": table.data,
			"columns": table.columns
		},
		"jobs-fed": {
			"data": table.data,
			"columns": table.columns,
			"missing": ["wwu"],
			"federation": capabilities.federation
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
	"federation-missing-notice": {
		"example": {
			"missing": ["wwu", "eodc"],
			"federation": capabilities.federation,
			"retry": asyncFn
		},
		"compact": {
			"missing": ["wwu", "eodc"],
			"federation": capabilities.federation,
			"compact": true
		}
	},
	"file-format": {
		"output-gtiff": {
			"id": "GTIFF",
			"format": fileFormatsApi.output.GTiff,
			"type": "output"
		},
		"output-gpkg": {
			"id": "GPKG",
			"format": fileFormatsApi.output.GPKG,
			"type": "output"
		},
		"input-gpkg": {
			"id": "GPKG",
			"format": fileFormatsApi.input.GPKG,
			"type": "input"
		}
	},
	"file-formats": {
		"api-all": {
			"formats": fileFormatsApi
		},
		"api-input": {
			"formats": fileFormatsApi,
			"show-output": false
		},
		"api-output": {
			"formats": fileFormatsApi,
			"show-input": false
		},
		"vito": {
			"formats": fileFormatsVito,
			"federation": capabilities.federation
		},
	},
	"item": {
		"batch-job": {
			"data": item
		},
		"ceos": {
			"data": itemCeos
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
		},
		"advanced-params": {
			"job": job,
			"processing-parameters": ppVito.create_job_parameters
		}
	},
	"job-estimate": {
		"minimal": {
			estimate: {},
			currency: "EUR"
		},
		"full": {
			estimate: {
				costs: 12.98,
				duration: "P1Y2M10DT2H30M",
				size: 15000000,
				downloads_included: 5,
				expires: "2020-11-01T00:00:00Z"
			},
			currency: "DKK"
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
	"logs": {
		"empty": {
			"logs": []
		},
		"example": {
			"logs": logs.logs
		},
		"example-fed": {
			"logs": logs.logs,
			"missing": ["wwu"],
			"federation": capabilities.federation
		}
	},
	"model-builder": {
		"empty": {
			"id": "empty",
			"height": "100px"
		},
		"external-process": {
			"id": "namespace-is-url",
			"value": externalProc
		},
		"sample-viewer-without-metadata": {
			"id": "sample",
			"value": mbSample
		},
		"sample-editable-without-metadata": {
			"id": "sample",
			"editable": true,
			"value": mbSample
		},
		"sample-editable-with-metadata": {
			"id": "sample",
			"editable": true,
			"value": mbSample,
			"collections": collections,
			"processes": processes
		},
		"mask-scl-dilation": {
			"id": "mask",
			"editable": true,
			"value": maskScl,
			"explicit-zoom": true
		},
		"slow": {
			"id": "slow",
			"editable": true,
			"value": slow,
			"explicit-zoom": true,
			"processes": processes
		},
		"clip": {
			"id": "clip",
			"value": clip
		},
		"ard-sr-parameter-used-in-children-editable": {
			"id": "ard",
			"value": ardSR,
			"processes": processes,
			"editable": true
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
		"load-collection": {
			"process": processes.find(p => p.id === 'load_collection')
		},
		"extrema": {
			"process": processes.find(p => p.id === 'extrema')
		},
		"api-reduce-new": {
			"process": reduceApi
		},
		"udp-array-find-nodata": {
			"process": udp,
			"show-graph": true,
			"namespace": "user"
		},
		"udp-mask-scl-dilation": {
			"process": maskScl,
			"show-graph": true,
			"namespace": "vito",
			"federation": capabilities.federation
		}
	},
	"processes": {
		"1.1.0": {
			"processes": processes,
			"federation": capabilities.federation,
			"deprecated-filter": true,
			"hide-deprecated": true,
			"experimental-filter": true,
			"hide-experimental": true,
		},
		"1.1.0-with-categories": {
			"processes": processes,
			"show-categories": true
		}
	},
	"processing-parameters": {
		"empty": {
			"parameters": []
		},
		"vito": {
			"title": "VITO Batch Job Processing Parameters",
			"parameters": ppVito.create_job_parameters
		},
		"api": {
			"parameters": ppApi.create_job_parameters
		}
	},
	// ToDo: SearchableList - see other implementing components for examples, e.g. Collections or Processes
	"searchable-list": {
		"empty": {},
		"async": {
			"data": [
				{id: "test", summary: "Test"},
			],
			"load-additional-data": asyncFn
		}
	},
	"service": {
		"empty": {
			"service": {},
			"currency": "EUR"
		},
		"example": {
			"service": service,
			"currency": "EUR",
			"processing-parameters": ppApi.create_service_parameters
		},
		"example-fed": {
			"service": {
				...service,
				"federation:backends": ["vito", "eodc"]
			},
			"currency": "EUR",
			"federation": capabilities.federation
		}
	},
	"service-type": {
		"wms": {
			"id": "WMS",
			"service": serviceTypes.WMS,
			"federation": capabilities.federation
		},
		"ogcapi-features": {
			"id": "OGCAPI-FEATURES",
			"service": serviceTypes['OGCAPI-FEATURES']
		}
	},
	"service-types": {
		"api": {
			"services": serviceTypes,
			"federation": capabilities.federation
		}
	},
	"stac": {
		"planet": {
			"url": "https://www.planet.com/data/stac/catalog.json"
		},
		"source-coop": {
			"url": "https://data.source.coop/fiboa/ai4sf/stac/collection.json"
		},
		"error": {
			"url": "https://nonsense.example"
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
			"runtime": runtimes["R"],
			"federation": capabilities.federation
		}
	},
	"udf-runtimes": {
		"api": {
			"runtimes": runtimes,
			"federation": capabilities.federation
		}
	}
}