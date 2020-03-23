<template>
	<section class="vue-component billing-plans">
		<div class="billing-currency">
			<template  v-if="currency !== null">
				<strong>Currency:</strong> {{ currency }}
			</template>
			<template v-else>No billing information provided.</template>
		</div>
		<h4>Plans</h4>
		<ul v-if="currency !== null && plans.length">
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
import BaseMixin from './BaseMixin.vue';
import Description from './Description.vue';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'BillingPlans',
	mixins: [BaseMixin],
	components: {
		Description
	},
	props: {
		billing: Object
	},
	data() {
		return {
			currency: null,
			defaultPlan: null,
			plans: []
		};
	},
    watch: {
        billing() {
            this.updateData();
        }
    },
	methods: {
		getPlanCount() {
			return this.plans.length;
		},
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