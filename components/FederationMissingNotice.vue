<template>
	<section v-if="services" class="vue-component message-block federation federation-backends federation-missing-notice" :class="{compact: compact}">
		<AsyncButton v-if="retry" confirm class="retry" :fn="retry">Retry</AsyncButton>
		<strong class="header">Incomplete</strong>
		<p>
			This data is incomplete as the following service{{services.length > 1 ? 's' : ''}} in the federation {{services.length > 1 ? 'are' : 'is'}} currently unavailable:
		</p>
		<ul>
			<li v-for="service in services" :key="service.url">
				<div class="fed-header">
					<strong class="fed-title">{{ service }}</strong>
					<ul v-if="!compact" class="badges small inline">
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
		compact: {
			type: Boolean,
			default: false
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

.vue-component.federation-missing-notice {
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

.vue-component.federation-missing-notice.compact {
	margin: 0;
	padding: 0.25em;

	strong, p, ul, ul li, ul li div {
		display: inline;
	}
	
	strong.header, p {
		margin-right: 5px;
	}
	
	ul {
		padding-left: 0;
	}

	li:not(:last-child)::after {
		content: ", "
	}
}
</style>