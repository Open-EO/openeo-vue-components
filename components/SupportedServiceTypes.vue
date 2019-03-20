<template>
	<ul class="vue-component service-types">
		<li v-for="(args, name) in serviceTypes" :key="name">{{ prettify(name) }}</li>
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