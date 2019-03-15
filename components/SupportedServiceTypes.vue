<template>
	<ul class="vue-component service-types">
		<li v-for="(args, name) in services" :key="name">{{ prettify(name) }}</li>
	</ul>
</template>

<script>
import Utils from '../utils.js';
import './base.css';

export default {
	name: 'SupportedServiceTypes',
	props: {
		version: String,
		services: Object
	},
  methods: {
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
}
</script>