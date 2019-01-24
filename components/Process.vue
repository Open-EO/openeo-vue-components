<template>
	<article class="process">

		<a class="anchor" :name="process.id"></a>
		<h2>{{ process.id }}</h2>

		<slot name="process-before-summary"></slot>

		<div class="summary" v-if="process.summary || process.deprecated || process.experimental || process.categories">
			<div class="process-bar">
				<ul class="categories" v-if="process.categories">
					<li class="category" v-for="(value, key) in process.categories" :key="key" v-text="formatCategory(value)"></li>
				</ul>
				<ul class="actions" v-if="provideDownload">
					<li class="action download"><a @click="download(process)">Download JSON</a></li>
				</ul>
			</div>
			<summary>
				{{ process.summary }}
				<template v-if="process.deprecated === true || process.experimental === true">
					<template v-if="process.summary"> — </template>
					<strong class="deprecated" v-if="process.deprecated === true">deprecated</strong>
					<strong class="experimental" v-if="process.experimental === true">experimental</strong>
				</template>
			</summary>
		</div>

		<slot name="process-after-summary"></slot>

		<button v-if="initiallyCollapsed" class="show-more-button" @click="toggle()">Show {{collapsed ? 'more' : 'less'}}</button>

		<div v-show="!collapsed">

			<slot name="process-before-details"></slot>

			<section class="description" v-if="process.description">
				<h3>Description</h3>
				<code class="signature" v-html="signature()"></code>
				<Description :description="process.description" />
				<DeprecationNotice v-if="process.deprecated === true" entity="process" />
				<ExperimentalNotice v-if="process.experimental === true" entity="process" />
			</section>

			<section class="parameters">
				<h3>Parameters</h3>
				<div v-for="(param, i) in process.parameters" :key="i">
					<h4>
						<code>{{ param.name }}</code>
						<strong class="required" v-if="param.required === true" title="required">*</strong>
					</h4>
					<div class="details">
						<Description v-if="param.description" :description="param.description" />
						<DeprecationNotice v-if="param.deprecated === true" entity="parameter" />
						<ExperimentalNotice v-if="param.experimental === true" entity="parameter" />
						<p class="media-type" v-if="param.media_type"><strong>Media type: </strong>{{ param.media_type }}</p>
						<div class="json-schema-container" v-if="param.schema">
							<JsonSchema :schema="param.schema" />
						</div>
					</div>
				</div>
				<p v-if="process.parameters.length === 0">This process has no parameters.</p>
			</section>

			<section class="returns">
				<h3>Return Value</h3>
				<Description v-if="process.returns.description" :description="process.returns.description" />
				<p class="media-type" v-if="process.returns.media_type"><strong>Media (MIME) type: </strong>{{ process.returns.media_type }}</p>
				<div class="json-schema-container" v-if="process.returns.schema">
					<JsonSchema :schema="process.returns.schema" />
				</div>
			</section>

			<section class="exceptions" v-if="process.exceptions">
				<h3>Errors/Exceptions</h3>
				<ul>
					<li class="exception" v-for="(exception, name) in process.exceptions" :key="name">
						<code>{{ name }}</code>
						<span class="http-code" v-if="exception.http"> — HTTP {{ exception.http }}</span>
						<span class="error-code" v-if="exception.code"> — {{ exception.code }}</span>
						<Description v-if="exception.description" :description="exception.description" />
						<div v-if="exception.message" class="message">Message: <em>{{ exception.message }}</em></div>
					</li>
				</ul>
			</section>

			<section class="examples" v-if="process.examples">
				<h3>Examples</h3>
				<ProcessExample v-for="(example, key) in process.examples" :key="key" :id="key" :example="example" :processId="process.id" :processParameterOrder="process.parameter_order" />
			</section>

			<section class="links" v-if="process.links">
				<h3>See Also</h3>
				<LinkList :links="process.links" />
			</section>

			<slot name="process-after-details"></slot>

		</div>

	</article>
</template>

<script>
import JsonSchema from './JsonSchema.vue';
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import ExperimentalNotice from './ExperimentalNotice.vue';
import ProcessExample from './ProcessExample.vue';
import LinkList from './LinkList.vue';
import Utils from '../utils.js';

export default {
	name: 'Process',
	components: {
		JsonSchema,
		DeprecationNotice,
		Description,
		ExperimentalNotice,
		ProcessExample,
		LinkList
	},
	props: {
		version: {
			type: String,
			default: '0.4.0'
		},
		processData: Object,
		provideDownload: {
			type: Boolean,
			default: true
		},
		initiallyCollapsed: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			collapsed: false
		}
	},
	computed: {
		process() {
			var process = Object.assign({}, this.processData);

			// Fill parameter order
			if (!Array.isArray(process.parameter_order)) {
				process.parameter_order = [];
				for(var key in process.parameters) {
					process.parameter_order.push(key);
				}
			}

			// Make parameters and parameter_order consistent
			var parameters = [];
			var order = [];
			for(var i in process.parameter_order) {
				var name = process.parameter_order[i];
				if (typeof process.parameters[name] === 'object') {
					var parameter = process.parameters[name];
					parameter.name = name;
					parameters.push(parameter);
					order.push(name);
				}
			}
			process.parameters = parameters;
			process.parameter_order = order;

			return process;
		}
	},
	beforeMount() {
		this.collapsed = this.initiallyCollapsed;
	},
	methods: {
		toggle() {
			this.collapsed = !this.collapsed;
		},
		formatCategory(name) {
			return name.replace('_', ' ');
		},
		signature: function(html = true) {
			var params = [];
			for(var i in this.process.parameters) {
				var p = this.process.parameters[i];
				var pType = Utils.dataType(p.schema, true);
				var req = (p.required ? '' : '?');
				var pStr;
				if (html) {
					pStr = '<span class="required">' + req + '</span><span class="data-type">' + Utils.htmlentities(pType) + '</span> <span class="param-name">' + p.name + "</span>";
				}
				else {
					pStr = req + pType + " " + p.name;
				}
				params.push(pStr);
			}
			var returns = Utils.dataType(this.process.returns.schema, true);
			var paramStr = "(" + params.join(", ") + ") : ";
			if (html) {
				return '<span class="process-name">' + this.process.id + '</span>' + paramStr + '<span class="data-type">' + Utils.htmlentities(returns) + "</span>";
			}
			else {
				return this.process.id + paramStr + returns;
			}
		},
		download() {
			var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.processData, null, 2));
			var downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", this.process.id + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		},
	}
}
</script>

<style scoped>
.required {
	color: red;
	font-weight: bold;
}
.process h3 {
	margin: 1.5em 0 0.75em 0;
	padding: 0.25em 0 0.25em 0;
	border-bottom: 1px dotted #ccc;
}
.process-bar {
	display: flex;
	align-items: baseline;
}
.categories, .actions {
	margin: 0 0 0.75em 0;
	padding: 0;
	list-style-type: none;
	display: inline-block;
}
.categories {
	flex: 3;
}
.actions {
	flex: 1;
	text-align: right;
}
.categories .category, .actions .action {
	display: inline-block;
	font-size: 0.8em;
	margin: 0 0.5em 0.5em 0;
	line-height: 1;
	text-align: center;
	white-space: nowrap;
	text-transform: uppercase;
	vertical-align: baseline;
	border-radius: 3px;
	color: #fff;
}
.categories .category {
	background-color: #6c757d;
	padding: 0.3em 0.5em;
}
.actions .action {
	background-color: chocolate;
}
.categories .category a, .actions .action a {
	padding: 0.3em 0.5em;
	color: #fff;
	display: block;
}
.categories .category a:hover, .actions .action a:hover {
	color: #fff;
	display: block;
}
strong.deprecated {
	color: red;
}
strong.experimental {
	color: blueviolet;
}
.parameters .details {
	margin-left: 1.5em;
}
.exception {
	margin-top: 0.5em;
}
.exception code {
	font-weight: bold;
}
.exception .styled-description {
	margin: 0.5em 0;
}
.exception .message {
	margin: 0.5em 0;
	font-size: 0.8em;
}
</style>

<style>
.process .signature {
	display: block;
	margin: 1em 0;
}
.process .signature .data-type {
	color: #693;
}
.process .signature .process-name, .process .signature .param-name {
	color: #369;
}
</style>