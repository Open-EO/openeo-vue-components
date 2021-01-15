<template>
	<div class="vue-component udf-runtimes">
		<SearchableList :data="runtimes" summaryKey="title" :hideSummaryOnExpand="true" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand">
			<template v-slot:summary="slot">
				<strong class="udf-identifier">{{ slot.summary.identifier }}</strong>
				<ul class="badges small">
					<template v-if="slot.item.type === 'docker' || (slot.item.docker && slot.item.tags)">
						<li class="badge docker">Docker</li>
						<li class="badge version" :class="{default: tag === slot.item.default}" v-for="tag in slot.item.tags" :key="tag">{{ tag }}</li>
					</template>
					<template v-else>
						<li class="badge version" :class="{default: version === slot.item.default}" v-for="(lang, version) in slot.item.versions" :key="version">{{ version }}</li>
					</template>
				</ul><br />
				<small>{{ slot.summary.summary }}</small>
			</template>
			<template v-slot:details="slot">
				<UdfRuntime :id="slot.summary.identifier" :data="slot.item">
					<template v-slot:title><span class="hidden" /></template>
				</UdfRuntime>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';
import SearchableList from './SearchableList.vue';

export default Utils.enableHtmlProps({
	name: 'UdfRuntimes',
	components: {
		SearchableList,
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
		allowExpand: {
			type: Boolean,
			default: true
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

<style scoped>
ul.searchable-list > li > summary strong.udf-identifier {
    display: inline;
    overflow: auto;
}
ul.udf-runtimes:empty::after {
	content: 'None';
	font-style: italic;
}

.badges {
	margin-left: 0.5em;
}
</style>