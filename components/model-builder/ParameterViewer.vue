<template>
	<div class="vue-component parameter-viewer">
		<header>
			<h2>{{ title }}</h2>
			<button class="close" @click="$emit('close')">Close</button>
		</header>
		<p v-if="data.length === 0">No parameters available.</p>
		<section v-else v-for="param in data" :key="param.name" :class="param.classes">
			<h3>{{ param.name }}</h3>
			<div v-if="param.description" class="description">
				<Description :description="param.description" />
			</div>
			<div v-if="param.isObject && param.value.from_node" class="externalData fromNode">
				<em>Output of <tt>#{{ param.value.from_node }}</tt></em>
			</div>
			<div v-else-if="param.isObject && param.value.from_parameter" class="externalData fromArgument">
				<em>Value of process parameter <tt>#{{ param.value.from_parameter }}</tt></em>
			</div>
			<ModelBuilder v-else-if="param.isObject && param.value.process_graph" :id="param.name" :value="param.value" />
			<ObjectTree v-else :data="param.value" />
		</section>
	</div>
</template>

<script>
import Utils from '../../utils';

export default {
	name: 'ParameterViewer',
	components: {
		Description: () => import('../Description.vue'),
		ModelBuilder: () => import('../ModelBuilder.vue'),
		ObjectTree: () => import('../ObjectTree.vue')
	},
	props: {
		title: {
			type: String,
			default: "Parameters"
		},
		parameters: {
			type: Array,
			default: () => ([])
		},
		values: {
			type: Object,
			default: () => ({})
		},
		selectParameterName: {
			type: String,
			default: null
		}
	},
	computed: {
		data() {
			return this.parameters.map(param => {
				let value = this.values[param.name];
				return {
					name: param.name,
					classes: {
						highlight: param.name === this.selectParameterName
					},
					description: param.description,
					value,
					isObject: Utils.isObject(value)
				};
			});
		}
	}
}
</script>

<style scoped>
.parameter-viewer {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 5;
	overflow: auto;
	padding: 1em;
	box-sizing: border-box;
	background-color: white;
}
.close {
	position: absolute;
	top: 1.1em;
	right: 1em;
}
header h2 {
	margin-top: 0;
	font-size: 1.2em;
}
h3 {
	font-size: 1.1em;
}
.highlight {
	outline: 1px dotted red;
}
</style>