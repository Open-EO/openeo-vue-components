<template>
	<ul class="vue-component file-formats">
		<li v-for="(args, name) in formats.formats" :key="name">{{ prettify(name) }}</li>
	</ul>
</template>

<script>
import Utils from '../utils.js';
import './base.css';

export default {
	name: 'SupportedFileFormats',
	props: {
		version: String,
		formats: Object
	},
  methods: {
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
}
</script>