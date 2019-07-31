<template>
	<ul class="vue-component service-types">
		<li v-for="name in sortedServiceTypes" :key="name">{{ prettify(name) }}</li>
	</ul>
</template>

<script>
import Utils from '../utils.js';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'SupportedServiceTypes',
	props: {
		version: String,
		services: Object
	},
	data() {
		return {
			serviceTypes: {}
		};
	},
    created() {
        this.updateData();
    },
    watch: {
        services() {
            this.updateData();
        },
        version() {
            this.updateData();
        }
    },
	computed: {
		sortedServiceTypes() {
			if (this.serviceTypes && typeof this.serviceTypes === 'object') {
				return Object.keys(this.serviceTypes).sort(Utils.compareStringCaseInsensitive);
			}
			return [];
		}
	},
	methods: {
        updateData() {
            this.serviceTypes = MigrateCapabilities.convertServiceTypesToLatestSpec(this.services, this.version);
        },
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
}
</script>

<style>
ul.service-types:empty::after {
	content: 'None';
	font-style: italic;
}
</style>