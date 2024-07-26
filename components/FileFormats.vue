<template>
	<div class="vue-component file-formats">
		<SearchableList
			:data="fileFormats"
			summaryKey="title"
			keywordsKey="gis_data_types"
			:showSummaryOnExpand="false"
			:externalSearchTerm="searchTerm"
			:externalHideDeprecated="hideDeprecated"
			:deprecatedFilter="deprecatedFilter"
			:externalHideExperimental="hideExperimental"
			:experimentalFilter="experimentalFilter"
			:sort="sort"
			:offerDetails="offerDetails"
			:heading="heading"
			:collapsed="collapsed"
			@detailsToggled="detailsToggled">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template v-if="missing" #content-start><FederationMissingNotice :missing="missing" :federation="federation" /></template>
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
				<FileFormat :id="slot.summary.identifier" :format="slot.item" :type="slot.item.type" :federation="federation">
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
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'FileFormats',
	components: {
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue')),
		FileFormat: () => Utils.loadAsyncComponent(import('./FileFormat.vue'))
	},
	mixins: [
		FederationMixin
	],
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
		},
		hideDeprecated: {
			type: Boolean,
			default: false
		},
		deprecatedFilter: {
			type: Boolean,
			default: false
		},
		hideExperimental: {
			type: Boolean,
			default: false
		},
		experimentalFilter: {
			type: Boolean,
			default: false
		},
		missing: {
			type: Array,
			default: null
		},
		...FederationMixin.props
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
					let format = Object.assign({id: `${name}-${type}`, name, type}, this.formats[type][name]);
					data.push(format);
				}
			}
			return data;
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	methods: {
		detailsToggled(...args) {
			this.$emit('detailsToggled', ...args);
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';
</style>