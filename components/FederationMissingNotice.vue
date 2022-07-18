<template>
	<section v-if="services" class="vue-component message-block federation federation-backends">
		<button v-if="retry" type="button" class="retry" @click="retry">
			<slot name="button-text">Retry</slot>
		</button>
		<strong class="header">Incomplete</strong>
		<p>
			The following list is incomplete as at least one of the services in the federation is currently not available.
			The data for the following services is missing: {{ services.join(', ') }}
		</p>
	</section>
</template>

<script>
import FederationMixin from './internal/FederationMixin.js';
import Utils from '../utils';

export default {
	name: 'FederationMissingNotice',
	mixins: [
		FederationMixin
	],
	props: {
		missing: {
			type: Array,
			required: true
		},
		retry: {
			type: Function,
			default: null
		},
		// Mixins don't work properly in web components,
		// see https://github.com/vuejs/vue-web-component-wrapper/issues/30,
		...FederationMixin.props
	},
	computed: {
		services() {
			if (!Array.isArray(this.missing)) {
				return null;
			}
			return this.missing.map(id => {
				if (Utils.isObject(this.federation) && Utils.isObject(this.federation[id]) && typeof this.federation[id].title === 'string') {
					return this.federation[id].title;
				}
				return id;
			});
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.federation-backends {
	background-color: rgba(255, 69, 0, 0.1);
	border: 1px solid orangered;

	> .header {
		color: orangered;
	}

	.fed-title {
		font-weight: normal;
	}

	.retry {
		float: right;
	}
}
</style>