<template>
	<div class="vue-component process-example">
		<h4>{{ title }}</h4>

		<div class="content">
			<Description v-if="example.description" :description="example.description" :preprocessor="processReferenceParser" />

			<div class="process-graph" v-if="example.process_graph">
				<Description :description="renderedGraph()" />
			</div>
			<div class="arguments" v-if="example.arguments">
				<code v-html="renderedArguments()"></code>
			</div>
		</div>
	</div>
</template>

<script>
import Description from './Description.vue';
import Utils from '../utils.js';
import { Utils as CommonUtils } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'ProcessExample',
	props: {
		id: Number,
		example: Object,
		processId: String,
		processParameters: Array,
		processReferenceParser: Function
	},
	components: {
		Description
	},
	computed: {
		identifier() {
			return "#" + (this.id + 1);
		},
		title() {
			return this.example.title ? this.example.title + " (" + this.identifier + ")" : "Example " + this.identifier;
		}
	},
	methods: {
		// deprecated
		renderedGraph() {
			var md = "##### Process Graph\n```json\n" + JSON.stringify(this.example.process_graph, null, 2) + "\n```";
			if (typeof this.example.returns !== 'undefined') {
				md += "\n##### Result\n```json\n" + JSON.stringify(this.example.returns, null, 2) + "\n```";
			}
			return md;
		},
		renderedArguments() {
			var params = [];
			for(var i in this.processParameters) {
				var param = this.processParameters[i];
				if (typeof this.example.arguments[param.name] !== 'undefined') {
					var arg = this.example.arguments[param.name];
					let displayValue;
					if (CommonUtils.isObject(arg) && arg.from_parameter) {
						displayValue ='<em title="Variable">$' + Utils.htmlentities(arg.from_parameter) + '</em>';
					}
					else if (CommonUtils.isObject(arg) && arg.from_node) {
						displayValue = '<em title="Result from other process">$' + Utils.htmlentities(arg.from_node) + '</em>';;
					}
					else {
						displayValue = JSON.stringify(arg);
					}
					params.push('<span class="param-name">' + param.name + '</span> = <span class="argument">' + displayValue + '</span>');
				}
			}
			var returns = "";
			if (typeof this.example.returns !== 'undefined') {
				returns = ' => <span class="return-value">' + JSON.stringify(this.example.returns) + '</span>';
			}
			return '<span class="process-name">' + this.processId + '</span>' + "(" + params.join(", ") + ")" + returns;
		}
	}
}
</script>

<style scoped>
.content {
	border-left: 0.5em solid #ccc;
	border-bottom: 1px dotted #ccc;
	padding: 0.5em;
	margin-left: 1.5em;
}
</style>