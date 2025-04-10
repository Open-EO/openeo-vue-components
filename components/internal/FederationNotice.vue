<template>
	<section v-if="unsupported.length > 0" class="vue-component message-block federation federation-backends">
		<strong class="header">Federation</strong>
		<p>This {{ entity }} is available through the following service{{ services.length > 1 ? 's' : '' }} in the federation:</p>
		<ul>
			<li v-for="service in services" :key="service.url">
				<div class="fed-header">
					<strong class="fed-title">{{ service.title }}</strong>
					<ul class="badges small inline">
						<li class="badge red" v-if="service.status === 'offline'">offline</li>
						<li class="badge green" v-else>online</li>
					</ul>
				</div>
			</li>
		</ul>
	</section>
</template>

<script>
import FederationMixin from './FederationMixin.js';
import Utils from '../../utils';

export default {
	name: 'FederationNotice',
	mixins: [
		FederationMixin
	],
	props: {
		entity: {
			type: String,
			default: 'resource'
		},
		backends: {
			type: Array,
			default: []
		},
		// Mixins don't work properly in web components,
		// see https://github.com/vuejs/vue-web-component-wrapper/issues/30,
		...FederationMixin.props
	},
	computed: {
		unsupported() {
			if (Utils.size(this.federation) === 0) {
				return this.backends;
			}
			else {
				let all = Object.keys(this.federation);
				let supported = Array.isArray(this.backends) ? this.backends : all;
				return all.filter(id => !supported.includes(id));
			}
		},
		services() {
			return this.backends.map(id => {
				let base = {
					title: id
				};
				if (Utils.isObject(this.federation) && id in this.federation) {
					Object.assign(base, this.federation[id]);
				}
				return base;
			});
		}
	}
}
</script>

<style lang="scss">
@import '../base.scss';

.vue-component.federation-backends {
	background-color: rgba(184, 134, 11, 0.1);
	border: 1px solid darkgoldenrod;

	> .header {
		color: darkgoldenrod;
	}

	.fed-title {
		font-weight: normal;
	}
}
</style>