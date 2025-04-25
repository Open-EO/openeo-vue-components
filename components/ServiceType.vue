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

		<section class="description" v-if="service.description || service.deprecated || service.experimental || service['federation:backends']">
			<template v-if="service.description">
				<h3>Description</h3>
				<Description :description="service.description" />
			</template>
			<DeprecationNotice v-if="service.deprecated" entity="type of secondary web service" />
			<ExperimentalNotice v-if="service.experimental" entity="type of secondary web service" />
			<FederationNotice v-if="service['federation:backends']" :backends="service['federation:backends']" :federation="federation" entity="type of secondary web service" />
		</section>

		<section class="configuration">
			<h3>Configuration Settings</h3>
			<ProcessParameter v-for="param in configuration" :key="param.name" :parameter="param" :federation="federation" />
			<p v-if="configuration.length === 0">No configuration settings available.</p>
		</section>

		<section class="parameters">
			<h3>Process Parameters</h3>
			<ProcessParameter v-for="param in parameters" :key="param.name" :parameter="param" :federation="federation" />
			<p v-if="parameters.length === 0">No process parameters available.</p>
		</section>

		<section class="links">
			<LinkList :links="service.links" heading="See Also" headingTag="h3" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import Utils from '../utils.js';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'ServiceType',
	components: {
		DeprecationNotice: () => import('./DeprecationNotice.vue'),
		Description: () => import('./Description.vue'),
		ExperimentalNotice: () => import('./ExperimentalNotice.vue'),
		ProcessParameter: () => import('./internal/ProcessParameter.vue'),
		LinkList: () => import('./LinkList.vue')
	},
	mixins: [
		FederationMixin
	],
	props: {
		id: {
			type: String,
			default: ''
		},
		service: {
			type: Object,
			default: () => ({})
		},
		...FederationMixin.props
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
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use './base.scss';
</style>