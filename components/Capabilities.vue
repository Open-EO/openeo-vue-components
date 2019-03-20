<template>
	<div class="vue-component capabilities">
		<h2>{{ document.title || hostName }}</h2>
		<section class="base-data">
			<div class="tabular"><label>URL:</label><span class="value">{{ url }}</span></div>
			<div class="tabular"><label>openEO-Version:</label><span class="value">{{ version }}</span></div>
		</section>
		<Description v-if="document.description" :description="document.description" />
		<h3>Supported functionalities</h3>
		<SupportedFeatures :version="document.version" :endpoints="document.endpoints" />
		<template v-if="document.billing">
			<h3>Billing</h3>
			<BillingPlans :version="document.version" :billing="document.billing" />
		</template>
	</div>
</template>

<script>
import BillingPlans from './BillingPlans.vue';
import Description from './Description.vue';
import SupportedFeatures from './SupportedFeatures.vue';
import { MigrateCapabilities } from '@openeo/js-commons';
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
	},
	data() {
		return {
			version: "",
			document: {}
		};
	},
	computed: {
		hostName() {
			var url = new URL(this.url);
			return url.hostname;
		}
	},
    created() {
        this.updateData();
    },
    watch: {
        services() {
            this.updateData();
        },
        version() {
            this.updateData();
        }
    },
	methods: {
        updateData() {
            this.version = MigrateCapabilities.guessApiVersion(this.capabilities);
            this.document = MigrateCapabilities.convertCapabilitiesToLatestSpec(this.capabilities, this.version, null);
        }
	}
}
</script>