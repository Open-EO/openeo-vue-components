<template>
	<ul class="vue-component features">
		<li v-for="(status, feature) in supportedFeatures" :key="feature">
            <span v-text="getIcon(status)" :class="{supported: status == 2, unsupported: status == 0, partial: status == 1}"></span> {{ feature }}
        </li>
	</ul>
</template>

<script>
import { FeatureList } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'SupportedFeatures',
	props: {
		version: String,
		endpoints: Array
    },
    data() {
        return {
            featureCount: 0,
            supportedFeatures: null,
            supportedFeatureCount: 0
        };
    },
    created() {
        this.updateData();
    },
    watch: {
        endpoints() {
            this.updateData();
        },
        version() {
            this.updateData();
        }
    },
    methods: {
        updateData() {
            this.featureCount = FeatureList.getFeatureCount();
            var report = FeatureList.getReport(this.endpoints, this.version);
            this.supportedFeatures = report.list;
            this.supportedFeatureCount = report.count;
        },
        getIcon(status) {
            switch(status) {
                case 1:
                    return '⚠️';
                case 2:
                    return '✔️';
                default:
                    return '❌';
            }
        },
        getSupportedFeatures() {
            return this.supportedFeatures;
        },
        getFeatureCount() {
            return this.featureCount;
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
