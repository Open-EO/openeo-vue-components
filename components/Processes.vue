<template>
	<div class="vue-component processes">
		<SearchableList
			:data="processes"
			keywordsKey="categories"
			:showKeywords="showCategories"
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
			:loadAdditionalData="loadAdditionalData"
			@detailsToggled="detailsToggled"
			allowCopy>
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #content-start v-if="Array.isArray(missing) && missing.length > 0"><FederationMissingNotice :missing="missing" :federation="federation" /></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Process :process="slot.item" :provideDownload="provideDownload" :processUrl="processUrl" :showGraph="showGraph" :federation="federation">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="process-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="process-end" v-bind="scope" /></template>
				</Process>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'Processes',
	components: {
		Process: () => Utils.loadAsyncComponent(import('./Process.vue')),
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue'))
	},
	mixins: [
		FederationMixin
	],
	props: {
		processes: {
			type: Array,
			default: () => ([])
		},
		provideDownload: {
			type: Boolean,
			default: true
		},
		processUrl: String,
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
			default: 'Processes'
		},
		collapsed: {
			type: Boolean,
			default: null
		},
		showCategories: {
			type: Boolean,
			default: false
		},
		showGraph: {
			type: Boolean,
			default: false
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
		loadAdditionalData: {
			type: Function,
			default: null
		},
		missing: {
			type: Array,
			default: null
		},
		...FederationMixin.props
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