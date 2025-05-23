<template>
	<div class="vue-component collections">
		<SearchableList
			:data="collections"
			identifierKey="id"
			summaryKey="title"
			keywordsKey="keywords"
			:showKeywords="showKeywords"
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
			<template #content-start="scope">
				<slot name="content-start" v-bind="scope"></slot>
				<FederationMissingNotice v-if="Array.isArray(missing) && missing.length > 0" :missing="missing" :federation="federation" />
			</template>
			<template #after-search-box="scope"><slot name="after-search-box" v-bind="scope"></slot></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Collection :data="slot.item" :mapOptions="mapOptions" :federation="federation">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="collection-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="collection-end" v-bind="scope" /></template>
					<template #spatial-extents="scope"><slot name="collection-spatial-extents" v-bind="scope" /></template>
					<template #temporal-extents="scope"><slot name="collection-temporal-extents" v-bind="scope" /></template>
				</Collection>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'Collections',
	components: {
		Collection: () => Utils.loadAsyncComponent(import('./Collection.vue')),
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue'))
	},
	mixins: [
		FederationMixin
	],
	props: {
		collections: {
			type: Array,
			default: () => ([])
		},
		mapOptions: {
			type: Object,
			default: () => ({})
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
			default: 'Collections'
		},
		collapsed: {
			type: Boolean,
			default: null
		},
		loadAdditionalData: {
			type: Function,
			default: null
		},
		showKeywords: {
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
@use './base.scss';
</style>