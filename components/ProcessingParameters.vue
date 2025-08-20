<template>
	<article class="vue-component processing-parameters">

		<slot name="title" v-bind="$props">
			<h2 v-if="title">{{ title }}</h2>
		</slot>

		<p v-if="sortedParameters.length === 0">No process parameters available.</p>
		<ProcessParameter v-for="param in sortedParameters" :key="param.name" :parameter="param" :federation="federation" />

	</article>
</template>

<script>
import Utils from '../utils.js';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'ProcessingParameters',
	components: {
		ProcessParameter: () => import('./internal/ProcessParameter.vue'),
	},
	mixins: [
		FederationMixin
	],
	props: {
		title: {
			type: String,
			default: 'Additional Processing Parameters'
		},
		parameters: {
			type: Array,
			default: () => ([])
		},
		...FederationMixin.props
	},
	computed: {
		sortedParameters() {
			if (Array.isArray(this.parameters)) {
				return this.parameters
					.slice(0) // Make copy for in-place sort
					.sort((a,b) => Utils.compareStringCaseInsensitive(a.name, b.name)); // Sort
			}
			else {
				return [];
			}
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use './base.scss';
</style>