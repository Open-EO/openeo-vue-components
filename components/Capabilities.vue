<template>
	<div class="vue-component capabilities">
		<h2>{{ title }}</h2>
		<section class="base-data">
			<div class="tabular" v-if="url2"><label>URL:</label><span class="value">{{ url2 }}</span></div>
			<div class="tabular" v-if="capabilities.api_version"><label>openEO-Version:</label><span class="value">{{ capabilities.api_version }}</span></div>
			<div class="tabular"><label>Production:</label><span class="value">
				<template v-if="capabilities.production">✔️</template>
				<template v-else>❌</template>
			</span></div>
		</section>
		<Description v-if="capabilities.description" :description="capabilities.description" />
		<SupportedFeatures :endpoints="capabilities.endpoints" headingTag="h3" />
		<BillingPlans v-if="capabilities.billing" :billing="capabilities.billing" headingTag="h3" />
		<LinkList :links="capabilities.links" heading="More information" headingTag="h3" />
	</div>
</template>

<script>
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
		}
	},
	components: {
		BillingPlans: () => import(/* webpackChunkName: "billing-plan" */'./BillingPlans.vue'),
		Description: () => import(/* webpackChunkName: "description" */'./Description.vue'),
		LinkList: () => import(/* webpackChunkName: "link-list" */'./LinkList.vue'),
		SupportedFeatures: () => import(/* webpackChunkName: "supported-features" */'./SupportedFeatures.vue')
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
		},
		url2() {
			if (typeof this.url === 'string') {
				return this.url;
			}
			else if (Array.isArray(this.capabilities.links)) {
				let self = this.capabilities.links.find(link => link.rel === 'self');
				if (self) {
					return self.href;
				}
			}
			return null;
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>