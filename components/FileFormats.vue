<template>
	<ul class="vue-component file-formats">
		<li v-for="f in fileFormats" :key="f.id">
			<strong>{{ f.id | abbrev }}</strong>
			<template v-if="f.title"> - {{ f.title }}</template>
			<ul class="badges small">
				<li class="badge input" v-if="showAll && f.type === 'input'">Import</li>
				<li class="badge output" v-if="showAll && f.type === 'output'">Export</li>
				<template v-if="Array.isArray(f.gis_data_types)">
					<li class="badge gis" v-for="type in f.gis_data_types" :key="type">{{ type }}</li>
				</template>
			</ul>
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
	name: 'FileFormats',
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
	computed: {
		showAll() {
			return this.showInput && this.showOutput;
		},
		typesToShow() {
			let types = [];
			if (this.showInput) {
				types.push('input');
			}
			if (this.showOutput) {
				types.push('output');
			}
			return types;
		},
		fileFormats() {
			let formats = MigrateCapabilities.convertFileFormatsToLatestSpec(this.formats, this.version);
			let data = [];
			for(let type of this.typesToShow) {
				for(var name in formats[type]) {
					let format = Object.assign({}, formats[type][name], {id: name, type: type});
					// Don't show title if equal to identifier
					if (Utils.compareStringCaseInsensitive(format.id, format.title) === 0) {
						delete format.title;
					}
					data.push(format);
				}
			}
			return Object.values(data).sort((a,b) => Utils.compareStringCaseInsensitive(a.id, b.id));
		}
	},
	methods: {
		getCount() {
			return CommonUtils.size(this.fileFormats);
		}
	}
}
</script>

<style scoped>
ul.file-formats:empty::after {
	content: 'None';
	font-style: italic;
}

.badges {
	margin-left: 0.5em;
}
.badges .input {
	background-color: darkslategray;
}
.badges .output {
	background-color: darkslateblue;
}
</style>