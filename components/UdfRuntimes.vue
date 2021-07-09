<template>
	<div class="vue-component udf-runtimes">
		<SearchableList :data="runtimes" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed" @detailsToggled="detailsToggled">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="slot">
				<slot name="summary" v-bind="slot">
					<strong class="inline">{{ slot.summary.identifier }}</strong>
					<ul class="badges small inline">
						<template v-if="slot.item.type === 'docker' || (slot.item.docker && slot.item.tags)">
							<li class="badge docker">Docker</li>
							<li class="badge version" :class="{default: tag === slot.item.default}" v-for="tag in slot.item.tags" :key="tag">{{ tag }}</li>
						</template>
						<template v-else>
							<li class="badge version" :class="{default: version === slot.item.default}" v-for="(lang, version) in slot.item.versions" :key="version">{{ version }}</li>
						</template>
					</ul><br />
					<small>{{ slot.summary.summary }}</small>
				</slot>
			</template>
			<template #details="slot">
				<UdfRuntime :id="slot.summary.identifier" :runtime="slot.item">
					<template #title><span class="hidden" /></template>
					<template #badges="scope"><slot name="udf-runtime-badges" v-bind="scope" /></template>
					<template #before-description="scope"><slot name="udf-runtime-before-description" v-bind="scope" /></template>
				</UdfRuntime>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'UdfRuntimes',
	components: {
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue')),
		UdfRuntime: () => Utils.loadAsyncComponent(import('./UdfRuntime.vue'))
	},
	props: {
		runtimes:  {
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
			default: 'UDF Runtimes'
		},
		collapsed: {
			type: Boolean,
			default: null
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