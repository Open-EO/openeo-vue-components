<template>
	<div class="vue-component file-formats">
		<SearchableList :data="fileFormats" summaryKey="title" :hideSummaryOnExpand="true" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand">
			<template v-slot:summary="slot">
				<strong class="inline">{{ slot.item.name }}</strong>
				<ul class="badges small inline">
					<li class="badge option1" v-if="showAll && slot.item.type === 'input'">Import</li>
					<li class="badge option2" v-if="showAll && slot.item.type === 'output'">Export</li>
					<template v-if="Array.isArray(slot.item.gis_data_types)">
						<li class="badge gis" v-for="type in slot.item.gis_data_types" :key="type">{{ type }}</li>
					</template>
				</ul><br />
				<small>{{ slot.summary.summary }}</small>
			</template>
			<template v-slot:details="slot">
				<FileFormat :id="slot.summary.identifier" :format="slot.item" :type="slot.item.type">
					<template v-slot:title><span class="hidden" /></template>
					<template v-slot:badges><span class="hidden" /></template>
				</FileFormat>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils.js';

export default Utils.enableHtmlProps({
	name: 'FileFormats',
	components: {
		SearchableList: () => import('./SearchableList.vue'),
		FileFormat: () => import('./FileFormat.vue')
	},
	props: {
		formats: {
			type: Object,
			default: () => ({})
		},
		showInput: {
			type: Boolean,
			default: true
		},
		showOutput: {
			type: Boolean,
			default: true
		},
		searchTerm: {
			type: String,
			default: null
		},
		sort: {
			type: Boolean,
			default: true
		},
		allowExpand: {
			type: Boolean,
			default: true
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
					let format = Object.assign({id: `${type}-${name}`, name, type}, this.formats[type][name]);
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
</style>