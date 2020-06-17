<template>
	<div class="vue-component process-parameter">
		<h4>
			<code>{{ parameter.name }}</code>
			<strong class="required" v-if="!parameter.optional" title="required">*</strong>
			<code class="default" v-if="typeof parameter.default !== 'undefined'">&nbsp;=&nbsp;{{ defaultValue }}</code>
		</h4>
		<div class="details">
			<Description v-if="parameter.description" :description="parameter.description" :preprocessor="processReferenceParser" />
			<DeprecationNotice v-if="parameter.deprecated === true" entity="parameter" />
			<ExperimentalNotice v-if="parameter.experimental === true" entity="parameter" />
			<div class="json-schema-container" v-if="parameter.schema">
				<JsonSchema :schema="parameter.schema" :processReferenceParser="processReferenceParser" />
			</div>
		</div>
	</div>
</template>

<script>
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import ExperimentalNotice from './ExperimentalNotice.vue';
import JsonSchema from './JsonSchema.vue';
import './base.css';

export default {
	name: 'ProcessParameter',
	props: {
		parameter: Object,
		processReferenceParser: Function
	},
	components: {
		DeprecationNotice,
		Description,
		ExperimentalNotice,
		JsonSchema
	},
	computed: {
		defaultValue() {
			return JSON.stringify(this.parameter.default);
		}
	}
}
</script>

<style scoped>
.process-parameter .details {
	margin-left: 1.5em;
}
.default {
	font-weight: normal;;
}
</style>