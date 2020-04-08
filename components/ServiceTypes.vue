<template>
	<ul class="vue-component service-types">
		<li v-for="service in serviceTypes" :key="service.id">
			<strong>{{ service.id | abbrev }}</strong>
			<template v-if="service.title"> - {{ service.title }}</template>
		</li>
	</ul>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import Utils from '../utils.js';
import { Utils as CommonUtils } from '@openeo/js-commons';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'ServiceTypes',
	mixins: [BaseMixin],
	props: {
		services: Object
	},
	computed: {
		serviceTypes() {
			let serviceTypes = MigrateCapabilities.convertServiceTypesToLatestSpec(this.services, this.version);
			let data = [];
			for(var name in serviceTypes) {
				serviceTypes[name].id = name;
				data.push(serviceTypes[name]);
			}
			return data.sort((a,b) => Utils.compareStringCaseInsensitive(a.id, b.id));
		}
	},
	methods: {
		getCount() {
			return CommonUtils.size(this.serviceTypes);
		}
	}
}
</script>

<style scoped>
ul.service-types:empty::after {
	content: 'None';
	font-style: italic;
}
</style>