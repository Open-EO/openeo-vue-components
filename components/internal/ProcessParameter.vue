<template>
	<div class="vue-component process-parameter">
		<h4>
			<code>{{ parameter.name }}</code>
			<strong class="required" v-if="!parameter.optional" title="required">*</strong>
			<code class="default" v-if="typeof parameter.default !== 'undefined'">&nbsp;=&nbsp;{{ defaultValue }}</code>
		</h4>
		<div class="details">
			<Description v-if="parameter.description" :description="parameter.description" :processUrl="processUrl" />
			<DeprecationNotice v-if="parameter.deprecated === true" entity="parameter" />
			<ExperimentalNotice v-if="parameter.experimental === true" entity="parameter" />
			<div class="json-schema-container" v-if="parameter.schema">
				<JsonSchema :schema="parameter.schema" :processUrl="processUrl" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ProcessParameter',
	props: {
		parameter: Object,
		processUrl: String
	},
	components: {
		DeprecationNotice: () => import('../DeprecationNotice.vue'),
		Description: () => import('../Description.vue'),
		ExperimentalNotice: () => import('../ExperimentalNotice.vue'),
		JsonSchema: () => import('../JsonSchema.vue')
	},
	computed: {
		defaultValue() {
			return JSON.stringify(this.parameter.default);
		}
	}
}
</script>

<style>
@import url('../base.css');
</style>

<style scoped>
.process-parameter .details {
	margin-left: 1.5em;
}
.default {
	font-weight: normal;
}
h4 code {
	font-size: 1.1em;
}
</style>