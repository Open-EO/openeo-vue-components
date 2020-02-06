<template>
	<ul class="vue-component file-formats">
		<li v-for="name in formatNames" :key="name">{{ name }}</li>
	</ul>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import Utils from '../utils.js';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'SupportedFileFormats',
	mixins: [BaseMixin],
	props: {
		formats: Object,
		showInput: {
			type: Boolean,
			default: false
		},
		showOutput: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			formatNames: []
		};
	},
    watch: {
        formats() {
            this.updateData();
        },
        showInput() {
            this.updateData();
        },
        showOutput() {
            this.updateData();
        }
	},
	methods: {
        updateData() {
			let formats = MigrateCapabilities.convertFileFormatsToLatestSpec(this.formats, this.version);
			let names = [].concat(
				this.showInput ? Object.keys(formats.input) : [],
				this.showOutput ? Object.keys(formats.output) : []
			);
			names = names.map(f => Utils.prettifyAbbreviation(f));
			names = [...new Set(names)];
			this.formatNames = names.sort(Utils.compareStringCaseInsensitive);
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