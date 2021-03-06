<template>
	<article class="vue-component process">

		<slot name="title" :v-bind="$props">
			<a class="anchor" :name="process.id"></a>
			<h2>{{ process.id }}</h2>
		</slot>

		<template v-if="provideDownload || hasElements(process.categories)">
			<div class="process-bar">
				<ul class="badges categories" v-if="hasElements(process.categories)">
					<li class="badge category" v-for="(value, key) in process.categories" :key="key" v-text="formatCategory(value)"></li>
				</ul>
				<ul class="badges actions" v-if="provideDownload">
					<li class="badge action download"><a class="badge-fill" @click="download">Download JSON</a></li>
				</ul>
			</div>
		</template>

		<template v-if="process.summary || process.deprecated || process.experimental">
			<summary>
				{{ process.summary }}
				<template v-if="process.deprecated || process.experimental">
					<template v-if="process.summary"> — </template>
					<strong class="deprecated" v-if="process.deprecated">deprecated</strong>
					<strong class="experimental" v-if="process.experimental">experimental</strong>
				</template>
			</summary>
		</template>

		<slot name="before-description" :v-bind="$props"></slot>

		<section class="description" v-if="process.description">
			<h3>Description</h3>
			<code class="signature" v-html="signature"></code>
			<Description :description="process.description" :processUrl="processUrl" />
			<DeprecationNotice v-if="process.deprecated" entity="process" />
			<ExperimentalNotice v-if="process.experimental" entity="process" />
		</section>

		<section class="parameters">
			<h3>Parameters</h3>
			<ProcessParameter v-for="(param, i) in parameters" :key="i" :parameter="param" :processUrl="processUrl" />
			<p v-if="parameters.length === 0">This process has no parameters.</p>
		</section>

		<section class="returns">
			<h3>Return Value</h3>
			<Description v-if="returns.description" :description="returns.description" :processUrl="processUrl" />
			<div class="json-schema-container" v-if="returns.schema">
				<JsonSchema :schema="returns.schema" />
			</div>
		</section>

		<section class="exceptions" v-if="hasElements(process.exceptions)">
			<h3>Errors/Exceptions</h3>
			<ul>
				<li class="exception" v-for="(exception, name) in process.exceptions" :key="name">
					<code>{{ name }}</code>
					<span class="http-code" v-if="exception.http"> — HTTP {{ exception.http }}</span>
					<span class="error-code" v-if="exception.code"> — {{ exception.code }}</span>
					<Description v-if="exception.description" :description="exception.description" :processUrl="processUrl" :compact="true" />
					<div v-if="exception.message" class="message">Message: <em>{{ exception.message }}</em></div>
				</li>
			</ul>
		</section>

		<section class="examples" v-if="hasElements(process.examples)">
			<h3>Examples</h3>
			<ProcessExample v-for="(example, key) in process.examples" :key="key" :id="key" :example="example" :processId="process.id" :processParameters="parameters" :processUrl="processUrl" />
			<LinkList :links="exampleLinks" heading="Processes" headingTag="h4" />
		</section>

		<section class="links">
			<LinkList :links="process.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'example']" />
		</section>

		<slot name="end" :v-bind="$props"></slot>

	</article>
</template>

<script>
import ProcessExample from './internal/ProcessExample.vue';
import Utils from '../utils.js';

export default {
	name: 'Process',
	components: {
		JsonSchema: () => import('./JsonSchema.vue'),
		DeprecationNotice: () => import('./DeprecationNotice.vue'),
		Description: () => import('./Description.vue'),
		ExperimentalNotice: () => import('./ExperimentalNotice.vue'),
		ProcessExample,
		ProcessParameter: () => import('./internal/ProcessParameter.vue'),
		LinkList: () => import('./LinkList.vue')
	},
	props: {
		process: {
			type: Object,
			default: () => ({})
		},
		provideDownload: {
			type: Boolean,
			default: true
		},
		processUrl: String
	},
	computed: {
		parameters() {
			if (Array.isArray(this.process.parameters)) {
				return this.process.parameters;
			}
			else {
				return [];
			}
		},
		returns() {
			if (Utils.isObject(this.process.returns)) {
				return this.process.returns;
			}
			else {
				return {};
			}
		},
		signature(html = true) {
			let params = [];
			for(let i in this.parameters) {
				let p = this.parameters[i];
				let pType = Utils.dataType(p.schema, true);
				let req = p.optional ? '?' : '';
				let pStr;
				if (html) {
					pStr = '<span class="optional">' + req + '</span><span class="data-type">' + Utils.htmlentities(pType) + '</span> <span class="param-name">' + p.name + "</span>";
				}
				else {
					pStr = req + pType + " " + p.name;
				}
				params.push(pStr);
			}
			let returns = Utils.dataType(this.returns.schema, true);
			let paramStr = "(" + params.join(", ") + ") : ";
			if (html) {
				return '<span class="process-name">' + this.process.id + '</span>' + paramStr + '<span class="data-type">' + Utils.htmlentities(returns) + "</span>";
			}
			else {
				return this.process.id + paramStr + returns;
			}
		},
		exampleLinks() {
			if (Array.isArray(this.process.links)) {
				return this.process.links.filter(l => l.rel === 'example');
			}
			return [];
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	methods: {
		hasElements(data) {
			return (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
		},
		formatCategory(name) {
			return name.replace('_', ' ');
		},
		download() {
			let dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.process, null, 2));
			let downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", this.process.id + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	}
}
</script>

<style>
@import url('./base.css');

.vue-component.process .process-bar {
	display: flex;
	align-items: baseline;
}
.vue-component.process .badges {
	margin-bottom: 0.75em;
}
.vue-component.process .categories {
	flex: 3;
}
.vue-component.process .actions {
	flex: 1;
	text-align: right;
}
.vue-component.process .actions .action {
	background-color: chocolate;
}
.vue-component.process .actions .action:hover {
	background-color: black;
}
.vue-component.process strong.deprecated {
	color: red;
}
.vue-component.process strong.experimental {
	color: blueviolet;
}
.vue-component.process .exception {
	margin-top: 0.5em;
}
.vue-component.process .exception code {
	font-weight: bold;
}
.vue-component.process .exception .styled-description {
	margin: 0.5em 0;
}
.vue-component.process .exception .message {
	margin: 0.5em 0;
	font-size: 0.8em;
}
.vue-component.process .process .signature {
	display: block;
	margin: 1em 0;
}
.vue-component.process .links:empty {
	display: none;
}
</style>