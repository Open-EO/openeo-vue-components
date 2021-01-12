<template>
	<ul class="vue-component file-formats">
		<li v-for="f in fileFormats" :key="f.id">
			<strong>{{ f.id | abbrev }}</strong>
			<template v-if="showTitle(f)"> - {{ f.title }}</template>
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
import Utils from '../utils.js';

export default Utils.enableHtmlProps({
	name: 'FileFormats',
	props: {
		formats: {
			type: Object,
			default: () => ({})
		},
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
			let data = [];
			for(let type of this.typesToShow) {
				for(var name in this.formats[type]) {
					let format = Object.assign({}, this.formats[type][name], {id: name, type: type});
					data.push(format);
				}
			}
			return Object.values(data).sort((a,b) => Utils.compareStringCaseInsensitive(a.id, b.id));
		}
	},
	filters: {
		abbrev: Utils.prettifyAbbreviation
	},
	methods: {
		showTitle(format) {
			return (Utils.compareStringCaseInsensitive(format.id, format.title) !== 0);
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

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