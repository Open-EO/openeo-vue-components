<template>
	<article class="vue-component service-type">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="id"></a>
			<h2>
				<template v-if="service.title">
					{{ service.title }}
					(<code class="id">{{ id | abbrev }}</code>)
				</template>
				<code class="id" v-else>{{ id | abbrev }}</code>
			</h2>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<section class="description" v-if="service.description">
			<h3>Description</h3>
			<Description :description="service.description" />
			<DeprecationNotice v-if="service.deprecated" entity="service" />
			<ExperimentalNotice v-if="service.experimental" entity="service" />
		</section>

		<section class="configuration">
			<h3>Configuration Settings</h3>
			<ProcessParameter v-for="(param, i) in configuration" :key="i" :parameter="param" />
			<p v-if="configuration.length === 0">This service has no configuration settings.</p>
		</section>

		<section class="parameters">
			<h3>Process Parameters</h3>
			<ProcessParameter v-for="(param, i) in parameters" :key="i" :parameter="param" />
			<p v-if="parameters.length === 0">This service has no process parameters.</p>
		</section>

		<section class="links">
			<LinkList :links="service.links" heading="See Also" headingTag="h3" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import Utils from '../utils.js';

export default Utils.enableHtmlProps({
	name: 'ServiceType',
	components: {
		DeprecationNotice: () => import('./DeprecationNotice.vue'),
		Description: () => import('./Description.vue'),
		ExperimentalNotice: () => import('./ExperimentalNotice.vue'),
		ProcessParameter: () => import('./internal/ProcessParameter.vue'),
		LinkList: () => import('./LinkList.vue')
	},
	props: {
		id: {
			type: String,
			default: ''
		},
		service: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		configuration() {
			return Utils.toProcessParameters(this.service.configuration);
		},
		parameters() {
			if (Array.isArray(this.service.process_parameters)) {
				return this.service.process_parameters
					.slice(0) // Make copy for in-place sort
					.sort((a,b) => Utils.compareStringCaseInsensitive(a.name, b.name)); // Sort
			}
			else {
				return [];
			}
		}
	},
	filters: {
		abbrev: Utils.prettifyAbbreviation
	}
})
</script>

<style>
@import url('./base.css');
</style>