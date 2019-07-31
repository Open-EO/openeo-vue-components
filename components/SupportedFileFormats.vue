<template>
	<ul class="vue-component file-formats">
		<li v-for="(args, name) in outputFormats" :key="name">{{ prettify(name) }}</li>
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
		hasFormats() {
			return this.outputFormats && Object.keys(this.outputFormats).length > 0;
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