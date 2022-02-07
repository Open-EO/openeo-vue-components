<template>
	<div class="vue-component process-parameter">
		<h4>
			<code>{{ parameter.name }}</code>
			<strong class="required" v-if="!parameter.optional" title="required">*</strong>
			<code class="default" v-if="hasDefault">&nbsp;=&nbsp;{{ defaultValue }}</code>
		</h4>
		<div class="details">
			<Description v-if="parameter.description" :description="parameter.description" :processUrl="processUrl" />
			<DeprecationNotice v-if="parameter.deprecated === true" entity="parameter" />
			<ExperimentalNotice v-if="parameter.experimental === true" entity="parameter" />
			<FederationNotice v-if="parameter['federation:backends']" :backends="parameter['federation:backends']" :federation="federation" entity="parameter" />
			<div class="json-schema-container" v-if="parameter.schema">
				<JsonSchema :schema="parameter.schema" :processUrl="processUrl" />
			</div>
		</div>
	</div>
</template>

<script>
import FederationMixin from './FederationMixin.js';

export default {
	name: 'ProcessParameter',
	components: {
		DeprecationNotice: () => import('../DeprecationNotice.vue'),
		Description: () => import('../Description.vue'),
		ExperimentalNotice: () => import('../ExperimentalNotice.vue'),
		JsonSchema: () => import('../JsonSchema.vue')
	},
	mixins: [
		FederationMixin
	],
	props: {
		parameter: {
			type: Object
		},
		processUrl: {
			type: String
		}
	},
	computed: {
		hasDefault() {
			return (typeof this.parameter.default !== 'undefined');
		},
		defaultValue() {
			return JSON.stringify(this.parameter.default);
		}
	}
}
</script>

<style lang="scss">
.vue-component.process-parameter {
	.details {
		margin-left: 1.5em;
	}
	.default {
		font-weight: normal;
	}
	h4 code {
		font-size: 1.15em;
	}
}
</style>