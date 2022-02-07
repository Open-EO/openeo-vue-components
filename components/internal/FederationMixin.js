export default {
	components: {
		FederationBackends: () => import('../internal/FederationBackends.vue'),
		FederationMissing: () => import('../internal/FederationMissing.vue')
	},
	props: {
		federation: {
			type: Object,
			default: () => ({})
		}
	}
};