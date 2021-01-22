<template>
	<div class="vue-component udf-runtimes">
		<SearchableList :data="runtimes" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
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
					<template #badges><slot name="udf-runtime-badges" /></template>
					<template #before-description><slot name="udf-runtime-before-description" /></template>
				</UdfRuntime>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'UdfRuntimes',
	components: {
		SearchableList: () => import('./SearchableList.vue'),
		UdfRuntime: () => import('./UdfRuntime.vue')
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
			default: false
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

<style scoped>
ul.udf-runtimes:empty::after {
	content: 'None';
	font-style: italic;
}
</style>