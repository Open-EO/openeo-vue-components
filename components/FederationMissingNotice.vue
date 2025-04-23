<template>
	<section v-if="services" class="vue-component message-block federation federation-backends">
		<AsyncButton v-if="retry" confirm class="retry" :fn="retry">Retry</AsyncButton>
		<strong class="header">Incomplete</strong>
		<p>
			This data is incomplete as the following service{{services.length > 1 ? 's' : ''}} in the federation {{services.length > 1 ? 'are' : 'is'}} currently unavailable:
		</p>
		<ul>
			<li v-for="service in services" :key="service.url">
				<div class="fed-header">
					<strong class="fed-title">{{ service }}</strong>
					<ul class="badges small inline">
						<li class="badge red">offline</li>
					</ul>
				</div>
			</li>
		</ul>
	</section>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'FederationMissingNotice',
	components: {
		AsyncButton: () => import('./internal/AsyncButton.vue')
	},
	props: {
		missing: {
			type: Array,
			required: true
		},
		retry: {
			type: Function,
			default: null
		},
		federation: {
			type: Object,
			default: () => ({})
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
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
@use './base.scss';

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