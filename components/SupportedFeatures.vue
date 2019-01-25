<template>
	<ul class="vue-component features">
		<li v-for="(status, functionality) in functionalities" :key="functionality"><span v-text="getIcon(status)"></span> {{functionality}}</li>
	</ul>
</template>

<script>
// Manual assignment of the endpoints above to individual features.
// A functionality is considered supported when ALL of the corresponding endpoints are supported.
const FUNCTIONALITIES_0_3 = {
    'Basic functionality': [
        'get /',
        'get /collections',
        'get /collections/{}',
        'get /processes',
        'get /output_formats'
    ],
    'Authenticate with HTTP Basic': [       // TODO: Remove later because this auth method should not be used
        'get /credentials/basic',
    //  'get /me'                           // not necessarily needed (just outputs metadata)
    ],
    'Authenticate with OpenID Connect': [   // TODO: Remove later because the user doesn't care HOW the auth works
        'get /credentials/oidc',
    //  'get /me'                           // not necessarily needed (just outputs metadata)
    ],
    'Batch processing': [
        'get /jobs',
        'post /jobs',
        'get /jobs/{}',
    //  'patch /jobs/{}',                   // not necessarily needed (can be achieved by deleting and re-creating)
        'delete /jobs/{}',
        'get /jobs/{}/results',
        'post /jobs/{}/results',
    //  'delete /jobs/{}/results'           // not necessarily needed (can be deleted by deleting the entire job)
    ],
    'Estimate processing costs': [
        'get /jobs/{}/estimate'
    ],
    'Preview processing results': [
        'post /preview'
    ],
    'Secondary web services': [
        'get /service_types',
        'get /services',
        'post /services',
        'get /services/{}',
    //  'patch /services/{}',               // not necessarily needed (can be achieved by deleting and re-creating)
        'delete /services/{}',
    ],
    'File storage': [
        'get /files/{}',
        'get /files/{}/{}',
        'put /files/{}/{}',
        'delete /files/{}/{}'
    ],
    'Stored process graphs': [
        'get /process_graphs',
        'post /process_graphs',
        'get /process_graphs/{}',
    //  'patch /process_graphs/{}',         // not necessarily needed (can be achieved by deleting and re-creating)
        'delete /process_graphs/{}'
    ],
    'Validate process graphs': [
        'post /validation',
    ],
    'Notifications and monitoring': [
        'get /subscription'
    ]
};

import './base.css';

export default {
	name: 'SupportedFeatures',
	props: {
		version: String,
		endpoints: Array
	},
	computed: {
		functionalities() {
            var supportedEndpoints = [];
            if (Array.isArray(this.endpoints)) {
                for(var i in this.endpoints) {
                    for(var j in this.endpoints[i].methods) {
                        // allow arbitrary parameter names => don't care about content in curly brackets
                        let request = this.endpoints[i].methods[j] + ' ' + this.endpoints[i].path.replace(/{[^}]+}/g, '{}');
                        supportedEndpoints.push(request.toLowerCase());
                    }
                }
            }

            let status = Object.assign({}, FUNCTIONALITIES_0_3);
            // Assign each functionality a supported flag (0 = none, 1 = partially, 2 = fully)
            Object.keys(status).forEach(key => {
                let requiredEndpoints = status[key];
                // Get a list of unsupported, but required endpoints
                let unsupported = requiredEndpoints.filter(requiredEndpoint => !supportedEndpoints.includes(requiredEndpoint));
                switch(unsupported.length) {
                    // No unsupported endpoints => fully supported
                    case 0:
                        status[key] = 2;
                        break;
                    // All endpoints are unsupported
                    case requiredEndpoints.length:
                        status[key] = 0;
                        break;
                    // Some endpoints are supported => partially supported
                    default:
                        status[key] = 1;
                }
            });

            return status;
		}
    },
    methods: {
        getIcon(status) {
            switch(status) {
                case 1:
                    return '⚠️';
                case 2:
                    return '✔️';
                default:
                    return '❌';
            }
        }
    }
}
</script>

<style scoped>
.features {
    padding: 0;
}
.features li {
    list-style-type: none;
}
</style>
