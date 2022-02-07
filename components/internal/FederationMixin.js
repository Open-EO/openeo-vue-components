export default {
	components: {
		FederationNotice: () => import('./FederationNotice.vue'),
		FederationMissingNotice: () => import('../FederationMissingNotice.vue')
	},
	props: {
		federation: {
			type: Object,
			default: () => ({})
		}
	}
};