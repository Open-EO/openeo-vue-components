<template>
	<div class="vue-component parameter-viewer">
		<header>
			<h2>{{ title }}</h2>
			<button class="close" @click="$emit('close')">Close</button>
		</header>
		<p v-if="data.length === 0">No parameters available.</p>
		<section v-else v-for="param in data" :key="param.name" :class="param.classes">
			<h3>{{ param.name }}</h3>
			<div v-if="param.isObject && param.value.from_node" class="externalData fromNode">
				<em>Output of <tt>#{{ param.value.from_node }}</tt></em>
			</div>
			<div v-else-if="param.isObject && param.value.from_parameter" class="externalData fromArgument">
				<em>Value of process parameter <tt>#{{ param.value.from_parameter }}</tt></em>
			</div>
			<ModelBuilder v-else-if="param.isObject && param.value.process_graph" :id="param.name" :value="param.value" :parent="parent" />
			<ObjectTree v-else :data="param.value" />
			<div v-if="param.description" class="description">
				<i class="fas fa-info-circle"></i>
				<Description :description="param.description" :compact="true" />
			</div>
		</section>
	</div>
</template>

<script>
import Utils from '../../utils';

export default {
	name: 'ParameterViewer',
	components: {
		Description: () => import('../Description.vue'),
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
		},
		parent: {
			type: Object,
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
	},
	beforeCreate() {
		// Circular dependency leads to errors when building with target wc(-async)
		// See https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
		this.$options.components.ModelBuilder = require('../ModelBuilder.vue').default;
	},
	mounted() {
		if (this.selectParameterName) {
			let elem = this.$el.querySelector('section.highlight');
			if (elem) {
				let top = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				let left = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				elem.scrollIntoView();
				document.documentElement.scrollTop = document.body.scrollTop = top;
				document.documentElement.scrollLeft = document.body.scrollLeft = left;
			}
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
.parameter-viewer > .model-builder {
	height: 400px;
}
.parameter-viewer > section {
	border-top: 1px dotted gray;
	margin: 1em 0;
}
.parameter-viewer > section > .description {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 1em;
}
.parameter-viewer > section > .description > i.fas {
	margin-right: 0.5em;
	color: gray;
}
.parameter-viewer > section > .description > .styled-description {
	flex-grow: 1;
	font-size: 0.9em;
	border-left: 1px solid gray;
	padding-left: 0.5em;
	color: gray;
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
.highlight h3 {
	color: red;
}
</style>