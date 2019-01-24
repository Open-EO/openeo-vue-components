<template>
	<div class="capabilities">
		<h2 v-if="capabilities.title">{{ capabilities.title }}</h2>
		<p>
			<strong>URL:</strong> {{ url }}<br />
			<strong>openEO-Version:</strong> {{ capabilities.version }}
		</p>
		<Description v-if="capabilities.description" :description="capabilities.description" />
		<h3>Supported functionalities</h3>
		<SupportedFeatures :version="capabilities.version" :endpoints="capabilities.endpoints" />
		<h3>Billing</h3>
		<BillingPlans :version="capabilities.version" :billing="capabilities.billing" />
	</div>
</template>

<script>
import BillingPlans from './BillingPlans.vue';
import Description from './Description.vue';
import SupportedFeatures from './SupportedFeatures.vue';

export default {
	name: 'Capabilities',
	props: {
		capabilities: Object,
		url: String
	},
	components: {
		BillingPlans,
		Description,
		SupportedFeatures
	}
}
</script>

<style scoped>

</style>