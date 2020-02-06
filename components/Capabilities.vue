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
		<template v-if="showServiceTypes">
			<h3>Secondary web services</h3>
			<SupportedServiceTypes :version="version" :services="serviceTypes" />
		</template>
		<template v-if="showFileFormats">
			<h3>File formats for Import</h3>
			<SupportedFileFormats :version="version" :formats="fileFormats" :showInput="true" />
			<h3>File formats for Export</h3>
			<SupportedFileFormats :version="version" :formats="fileFormats" :showOutput="true" />
		</template>
		<LinkList :links="document.links" :billing="document.billing" heading="More information" headingTag="h3" />
	</div>
</template>

<script>
import BillingPlans from './BillingPlans.vue';
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import SupportedFeatures from './SupportedFeatures.vue';
import SupportedFileFormats from './SupportedFileFormats.vue';
import SupportedServiceTypes from './SupportedServiceTypes.vue';
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
		}
	},
	components: {
		BillingPlans,
		Description,
		LinkList,
		SupportedFeatures,
		SupportedFileFormats,
		SupportedServiceTypes
	},
	data() {
		return {
			version: "",
			document: {}
		};
	},
	computed: {
		showServiceTypes() {
			return CommonUtils.isObject(this.serviceTypes);
		},
		showFileFormats() {
			return CommonUtils.isObject(this.fileFormats);
		},
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