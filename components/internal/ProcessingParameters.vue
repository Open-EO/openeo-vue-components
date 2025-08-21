<template>
	<section v-if="show" class="openeo-vue-component processing-parameters">
		<h3>Advanced Parameters</h3>
		<div class="row" v-for="param in sortedParameters" :key="param.name">
			<div class="tabular">
				<label>{{ param.name }}:</label>
				<ObjectTree class="value" :data="values[param.name]" />
			</div>
			<Description v-if="param.description" :description="param.description" compact />
		</div>
	</section>
</template>

<script>
import Utils from '../../utils.js';

export default {
	name: 'ProcessingParameters',
	components: {
		Collapse: () => import('./Collapse.vue'),
		Description: () => import('../Description.vue'),
		ObjectTree: () => import('../ObjectTree.vue')
	},
	props: {
		parameters: {
			type: Array,
			default: () => ([])
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		values() {
			const keys = this.parameters
				.map(param => param.name)
				.filter(key => key in this.data);
			return Utils.pickFromObject(this.data, keys);
		},
		show() {
			return Utils.size(this.values) > 0;
		},
		sortedParameters() {
			if (Array.isArray(this.parameters)) {
				const params = this.parameters.filter(param => param.name in this.values);
				params.sort((a,b) => Utils.compareStringCaseInsensitive(a.name, b.name));
				return params;
			}
			else {
				return [];
			}
		}
	}
}
</script>

<style lang="scss">
.openeo-vue-component.processing-parameters {
	.row {
		margin-bottom: 0.75em;

		.styled-description {
			font-size: 0.8em;
			color: #666;
		}

		.value {
			> ol,
			> ul {
				margin: 0;
			}
		}
	}
}
</style>