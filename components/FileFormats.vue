<template>
	<div class="vue-component file-formats">
		<SearchableList :data="fileFormats" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="slot">
				<slot name="summary" v-bind="slot">
					<strong class="inline">{{ slot.item.name }}</strong>
					<ul class="badges small inline">
						<li class="badge option1" v-if="showAll && slot.item.type === 'input'">Import</li>
						<li class="badge option2" v-if="showAll && slot.item.type === 'output'">Export</li>
						<template v-if="Array.isArray(slot.item.gis_data_types)">
							<li class="badge gis" v-for="type in slot.item.gis_data_types" :key="type">{{ type }}</li>
						</template>
					</ul><br />
					<small>{{ slot.summary.summary }}</small>
				</slot>
			</template>
			<template #details="slot">
				<FileFormat :id="slot.summary.identifier" :format="slot.item" :type="slot.item.type">
					<template #title><span class="hidden" /></template>
					<template #badges><span class="hidden" /></template>
					<template #before-description="scope"><slot name="file-format-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="file-format-end" v-bind="scope" /></template>
				</FileFormat>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils.js';

export default {
	name: 'FileFormats',
	components: {
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue')),
		FileFormat: () => Utils.loadAsyncComponent(import('./FileFormat.vue'))
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
		offerDetails: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: 'File Formats'
		},
		collapsed: {
			type: Boolean,
			default: null
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
			return data;
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@import './base.scss';
</style>