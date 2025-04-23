<template>
	<div class="vue-component service-types">
		<SearchableList
			:data="services"
			summaryKey="title"
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
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<ServiceType :id="slot.summary.identifier" :service="slot.item" :federation="federation">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="service-type-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="service-type-end" v-bind="scope" /></template>
				</ServiceType>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils.js';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'ServiceTypes',
	components: {
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue')),
		ServiceType: () => Utils.loadAsyncComponent(import('./ServiceType.vue'))
	},
	mixins: [
		FederationMixin
	],
	props: {
		services: {
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
			default: 'Secondary Web Services'
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