<template>
	<div class="vue-component capabilities">
		<h2 v-if="capabilities.title">{{ capabilities.title }}</h2>
		<section class="base-data">
			<div class="tabular"><label>URL:</label><span class="value">{{ url }}</span></div>
			<div class="tabular"><label>openEO-Version:</label><span class="value">{{ capabilities.version }}</span></div>
		</section>
		<Description v-if="capabilities.description" :description="capabilities.description" />
		<h3>Supported functionalities</h3>
		<SupportedFeatures :version="capabilities.version" :endpoints="capabilities.endpoints" />
		<template v-if="capabilities.billing">
			<h3>Billing</h3>
			<BillingPlans :version="capabilities.version" :billing="capabilities.billing" />
		</template>
	</div>
</template>

<script>
import BillingPlans from './BillingPlans.vue';
import Description from './Description.vue';
import SupportedFeatures from './SupportedFeatures.vue';
import './base.css';

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