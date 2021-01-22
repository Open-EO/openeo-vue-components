<template>
	<div class="vue-component process-example">
		<h4>{{ title }}</h4>

		<div class="content">
			<Description v-if="example.description" :description="example.description" :processUrl="processUrl" />

			<div class="arguments" v-if="example.arguments">
				<code v-html="renderedArguments"></code>
			</div>
		</div>
	</div>
</template>

<script>
import Utils from '../../utils.js';

export default {
	name: 'ProcessExample',
	props: {
		id: Number,
		example: Object,
		processId: String,
		processParameters: Array,
		processUrl: String
	},
	components: {
		Description: () => import('../Description.vue')
	},
	computed: {
		identifier() {
			return "#" + (this.id + 1);
		},
		title() {
			return this.example.title ? this.example.title + " (" + this.identifier + ")" : "Example " + this.identifier;
		},
		renderedArguments() {
			var params = [];
			for(var i in this.processParameters) {
				var param = this.processParameters[i];
				if (typeof this.example.arguments[param.name] !== 'undefined') {
					var arg = this.example.arguments[param.name];
					let displayValue;
					if (Utils.isObject(arg) && arg.from_parameter) {
						displayValue ='<em title="Variable">$' + Utils.htmlentities(arg.from_parameter) + '</em>';
					}
					else if (Utils.isObject(arg) && arg.from_node) {
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

<style>
@import url('../base.css');

.vue-component.process-example .content {
	border-left: 0.5em solid #ccc;
	border-bottom: 1px dotted #ccc;
	padding: 0.5em;
	margin-left: 1.5em;
}
</style>