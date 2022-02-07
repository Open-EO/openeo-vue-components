export default {
	components: {
		FederationBackends: () => import('../internal/FederationBackends.vue')
	},
	props: {
		federation: {
			type: Object,
			default: () => ({})
		}
	}
};