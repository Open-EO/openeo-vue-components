<template>
	<ul class="vue-component features">
		<li v-for="(status, feature) in supportedFeatures" :key="feature">
            <span v-text="status.icon" :class="status.className" :title="status.tooltip"></span> {{ feature }}
        </li>
	</ul>
</template>

<script>
import FeatureList from '../featurelist';
import './base.css';

export default {
	name: 'SupportedFeatures',
	props: {
		endpoints: {
			type: Array,
			default: () => ([])
		},
    },
    data() {
        return {
            supportedFeatures: {},
            supportedFeatureCount: 0
        };
    },
    watch: {
        endpoints() {            
            // Flatten list of supported endpoints
            let supportedEndpointList = [];
            for(let endpoint of this.endpoints) {
                for(let method of endpoint.methods) {
                    let request = method + ' ' + endpoint.path;
                    supportedEndpointList.push(request.toLowerCase());
                }
            }

            // Reset variables
            this.supportedFeatureCount = 0;
            this.supportedFeatures = {};
    
            // Create report
            for(let feature in FeatureList.features) {
                let requiredEndpointsWithDescriptions = FeatureList.features[feature];
                let requiredEndpoints = Object.keys(requiredEndpointsWithDescriptions);
                // Get a list of unsupported, but required endpoints
                let unsupported = requiredEndpoints.filter(requiredEndpoint => !supportedEndpointList.includes(requiredEndpoint));
                let icon;
                let className;
                let tooltip;
                switch(unsupported.length) {
                    case 0:
                        // No unsupported endpoints => fully supported
                        this.supportedFeatureCount++;
                        icon = '✔️';
                        className = 'supported';
                        tooltip = 'fully supported';
                        break;
                    case requiredEndpoints.length:
                        // All endpoints are unsupported
                        icon = '❌';
                        className = 'unsupported';
                        tooltip = 'not supported';
                        break;
                    default:
                        // Some endpoints are supported => partially supported
                        icon = '⚠️';
                        className = 'partial';
                        tooltip = 'partially supported, missing: ' + unsupported.map(ep => requiredEndpointsWithDescriptions[ep]).join(', ');
                }
                this.supportedFeatures[feature] = {
                    icon: icon,
                    className: className,
                    tooltip: tooltip,
                    missingEndpoints: unsupported
                };
            }
        }
    },
    methods: {
        getFeatures() {
            return Object.keys(FeatureList.features);
        },
        getFeatureCount() {
            return this.getFeatures().length;
        },
        getSupportedFeatures() {
            return this.supportedFeatures;
        },
        getSupportedFeatureCount() {
            return this.supportedFeatureCount;
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
.supported {
    color: darkgreen;
}
.unsupported {
    color: maroon;
}
.partial {
    color: darkgoldenrod;
}
</style>
