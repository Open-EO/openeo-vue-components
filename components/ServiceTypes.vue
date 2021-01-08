<template>
	<ul class="vue-component service-types">
		<li v-for="service in serviceTypes" :key="service.id">
			<strong>{{ service.id | abbrev }}</strong>
			<template v-if="showTitle(service)"> - {{ service.title }}</template>
		</li>
	</ul>
</template>

<script>
import Utils from '../utils.js';
import './base.css';

export default {
	name: 'ServiceTypes',
	props: {
		services: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		serviceTypes() {
			let data = [];
			for(var name in this.services) {
				let service = Object.assign({}, this.services[name]);
				service.id = name;
				data.push(service);
			}
			return data.sort((a,b) => Utils.compareStringCaseInsensitive(a.id, b.id));
		}
	},
	filters: {
		abbrev: Utils.prettifyAbbreviation
	},
	methods: {
		showTitle(service) {
			return (Utils.compareStringCaseInsensitive(service.id, service.title) !== 0);
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