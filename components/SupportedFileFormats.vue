<template>
	<ul class="vue-component file-formats">
		<li v-for="name in sortedFormats" :key="name">{{ prettify(name) }}</li>
	</ul>
</template>

<script>
import Utils from '../utils.js';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'SupportedFileFormats',
	props: {
		version: String,
		formats: Object
	},
	data() {
		return {
			outputFormats: {}
		};
	},
    created() {
        this.updateData();
    },
    watch: {
        formats() {
            this.updateData();
        },
        version() {
            this.updateData();
        }
	},
	computed: {
		sortedFormats() {
			if (this.formats && typeof this.formats === 'object') {
				return Object.keys(this.formats).sort(Utils.compareStringCaseInsensitive);
			}
			return [];
		}
	},
	methods: {
        updateData() {
            this.outputFormats = MigrateCapabilities.convertOutputFormatsToLatestSpec(this.formats, this.version);
        },
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
}
</script>

<style>
ul.file-formats:empty::after {
	content: 'None';
	font-style: italic;
}
</style>