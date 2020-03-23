<template>
	<ul class="vue-component service-types">
		<li v-for="name in serviceTypeNames" :key="name">{{ name }}</li>
	</ul>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import Utils from '../utils.js';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'SupportedServiceTypes',
	mixins: [BaseMixin],
	props: {
		services: Object
	},
	data() {
		return {
			serviceTypeNames: []
		};
	},
    watch: {
        services() {
            this.updateData();
        }
    },
	methods: {
		getCount() {
			return this.serviceTypeNames.length;
		},
        updateData() {
			let serviceTypes = MigrateCapabilities.convertServiceTypesToLatestSpec(this.services, this.version);
			this.serviceTypeNames = Object.keys(serviceTypes)
					.map(f => Utils.prettifyAbbreviation(f))
					.sort(Utils.compareStringCaseInsensitive);
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