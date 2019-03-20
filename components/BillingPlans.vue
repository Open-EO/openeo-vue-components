<template>
	<section class="vue-component billing-plans">
		<div class="billing-currency" v-if="currency">
			<strong>Currency:</strong> {{ currency }}
		</div>
		<h4>Plans</h4>
		<ul v-if="plans.length">
			<li v-for="(plan, key) in plans" :key="key">
				<strong class="plan-name">
					<a v-if="plan.url" :href="plan.url" target="_blank">{{ plan.name }}</a>
					<template v-else>{{ plan.name }}</template>
				</strong>
				<ul class="badges small">
					<li class="badge default" v-if="defaultPlan == plan.name">default</li>
					<li class="badge paid" v-if="plan.paid === true">paid</li>
					<li class="badge free" v-else-if="plan.paid === false">free</li>
				</ul>
				<Description v-if="plan.description" :description="plan.description" :compact="true" />
			</li>
		</ul>
		<div v-else>No plans available.</div>
	</section>
</template>

<script>
import Description from './Description.vue';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'BillingPlans',
	components: {
		Description
	},
	props: {
		version: String,
		billing: Object
	},
	data() {
		return {
			currency: null,
			defaultPlan: null,
			plans: []
		};
	},
    created() {
        this.updateData();
    },
    watch: {
        billing() {
            this.updateData();
        },
        version() {
            this.updateData();
        }
    },
	methods: {
        updateData() {
			var b = MigrateCapabilities.convertBillingToLatestSpec(this.billing, this.version);
			this.currency = typeof b.currency === 'string' ? b.currency : null;
			this.defaultPlan = typeof b.default_plan === 'string' ? b.default_plan : null;
			this.plans = Array.isArray(b.plans) ? b.plans : [];
        },
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
}
</script>

<style scoped>
.badges {
	margin-left: 0.5em;
}
.badges .free {
	background-color: green;
}
.badges .paid {
	background-color: maroon;
}
.badges .default {
	background-color: darkblue;
}
.plan-name {
	margin: 0.25em 0;
	padding: 0.2em 0;
	line-height: 1em;
	vertical-align: baseline;
}
</style>