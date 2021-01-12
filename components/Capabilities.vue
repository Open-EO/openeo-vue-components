<template>
	<div class="vue-component capabilities">
		<h2>{{ title }}</h2>
		<section class="base-data">
			<div class="tabular" v-if="url"><label>URL:</label><span class="value">{{ url }}</span></div>
			<div class="tabular" v-if="capabilities.api_version"><label>openEO-Version:</label><span class="value">{{ capabilities.api_version }}</span></div>
			<div class="tabular"><label>Production:</label><span class="value">
				<template v-if="capabilities.production">✔️</template>
				<template v-else>❌</template>
			</span></div>
		</section>
		<Description v-if="capabilities.description" :description="capabilities.description" />
		<h3>Supported functionalities</h3>
		<SupportedFeatures :endpoints="capabilities.endpoints" />
		<template v-if="capabilities.billing">
			<h3>Billing</h3>
			<BillingPlans :billing="capabilities.billing" />
		</template>	
		<h3>File formats for Import</h3>
		<FileFormats :version="version" :formats="fileFormats" :showInput="true" />
		<h3>File formats for Export</h3>
		<FileFormats :version="version" :formats="fileFormats" :showOutput="true" />
		<h3>Secondary web services</h3>
		<ServiceTypes :version="version" :services="serviceTypes" />
		<h3>Runtimes for User-Defined Functions (UDF)</h3>
		<UdfRuntimes :version="version" :runtimes="udfRuntimes" />
		<LinkList :links="capabilities.links" :billing="capabilities.billing" heading="More information" headingTag="h3" />
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
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Capabilities',
	props: {
		capabilities: {
			type: Object,
			default: () => ({})
		},
		url: {
			type: String
		},
		serviceTypes: {
			type: Object
		},
		fileFormats: {
			type: Object
		},
		udfRuntimes: {
			type: Object
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
	computed: {
		title() {
			if (typeof this.capabilities.title === 'string' && this.capabilities.title.length > 0) {
				return this.capabilities.title;
			}
			else {
				try {
					var url = new URL(this.url);
					return url.hostname;
				} catch (error) {
					return '';
				}
			}
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>