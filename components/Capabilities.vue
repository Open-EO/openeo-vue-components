<template>
	<div class="vue-component capabilities">
		<h2>{{ document.title || hostName }}</h2>
		<section class="base-data">
			<div class="tabular"><label>URL:</label><span class="value">{{ url }}</span></div>
			<div class="tabular"><label>openEO-Version:</label><span class="value">{{ version }}</span></div>
			<div class="tabular"><label>Production:</label><span class="value">
				<template v-if="document.production">✔️</template>
				<template v-else>❌</template>
			</span></div>
		</section>
		<Description v-if="document.description" :description="document.description" />
		<h3>Supported functionalities</h3>
		<SupportedFeatures :endpoints="document.endpoints" />
		<template v-if="document.billing">
			<h3>Billing</h3>
			<BillingPlans :billing="document.billing" />
		</template>	
		<h3>File formats for Import</h3>
		<FileFormats :version="version" :formats="fileFormats" :showInput="true" />
		<h3>File formats for Export</h3>
		<FileFormats :version="version" :formats="fileFormats" :showOutput="true" />
		<h3>Secondary web services</h3>
		<ServiceTypes :version="version" :services="serviceTypes" />
		<h3>Runtimes for User-Defined Functions (UDF)</h3>
		<UdfRuntimes :version="version" :runtimes="udfRuntimes" />
		<LinkList :links="document.links" :billing="document.billing" heading="More information" headingTag="h3" />
	</div>
</template>

<script>
import BillingPlans from './BillingPlans.vue';
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import SupportedFeatures from './SupportedFeatures.vue';
import FileFormats from './FileFormats.vue';
import ServiceTypes from './ServiceTypes.vue';
import UdfRuntimes from './UdfRuntimes.vue';
import { MigrateCapabilities, Utils as CommonUtils } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'Capabilities',
	props: {
		capabilities: Object,
		url: String,
		serviceTypes: {
			type: Object,
			default: null
		},
		fileFormats: {
			type: Object,
			default: null
		},
		udfRuntimes: {
			type: Object,
			default: null
		}
	},
	components: {
		BillingPlans,
		Description,
		LinkList,
		SupportedFeatures,
		FileFormats,
		ServiceTypes,
		UdfRuntimes
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
        version() {
            this.updateData();
        }
    },
	methods: {
        updateData() {
            this.version = MigrateCapabilities.guessApiVersion(this.capabilities);
            this.document = MigrateCapabilities.convertCapabilitiesToLatestSpec(this.capabilities, this.version, false, true);
        }
	}
}
</script>