<template>
	<article class="vue-component file-format">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="id"></a>
			<h2>
				<template v-if="format.title">
					{{ format.title }}
					(<code class="id">{{ id | abbrev }}</code>)
				</template>
				<code class="id" v-else>{{ id | abbrev }}</code>
			</h2>
		</slot>

		<slot name="badges" v-bind="$props">
			<ul class="badges">
				<li class="badge option1" v-if="type === 'input'">Import</li>
				<li class="badge option2" v-if="type === 'output'">Export</li>
				<template v-if="Array.isArray(format.gis_data_types)">
					<li class="badge gis" v-for="gisType in format.gis_data_types" :key="gisType">{{ gisType }}</li>
				</template>
			</ul>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<section class="description" v-if="format.description">
			<h3>Description</h3>
			<Description :description="format.description" />
			<DeprecationNotice v-if="format.deprecated" entity="file format" />
			<ExperimentalNotice v-if="format.experimental" entity="file format" />
		</section>

		<FederationBackends v-if="format['federation:backends']" :backends="format['federation:backends']" :federation="federation" entity="file format" />

		<section class="parameters">
			<h3>Parameters</h3>
			<ProcessParameter v-for="param in parameters" :key="param.name" :parameter="param" :federation="federation" />
			<p v-if="parameters.length === 0">This file format has no parameters.</p>
		</section>

		<section class="links">
			<LinkList :links="format.links" heading="See Also" headingTag="h3" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import Utils from '../utils.js';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'FileFormat',
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
		format: {
			type: Object,
			default: () => ({})
		},
		type: {
			type: String,
			default: null
		},
		...FederationMixin.props
	},
	computed: {
		parameters() {
			return Utils.toProcessParameters(this.format.parameters);
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
@import './base.scss';
</style>