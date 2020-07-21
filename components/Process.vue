<template>
	<article class="vue-component process"><div :class="{collapsible: initiallyCollapsed, expanded: !collapsed}">

		<a class="anchor" :name="process.id"></a>
		<h2 @click="toggle()">
			<span class="toggle">▸</span>{{ process.id }}
		</h2>

		<slot name="process-before-summary"></slot>

		<template v-if="provideDownload || hasElements(process.categories)">
			<div class="process-bar">
				<ul class="badges categories" v-if="hasElements(process.categories)">
					<li class="badge category" v-for="(value, key) in process.categories" :key="key" v-text="formatCategory(value)"></li>
				</ul>
				<ul class="badges actions" v-if="provideDownload">
					<li class="badge action download"><a class="badge-fill" @click="download(process)">Download JSON</a></li>
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

		<slot name="process-after-summary"></slot>

		<div v-if="!collapsed">

			<slot name="process-before-details"></slot>

			<section class="description" v-if="process.description">
				<h3>Description</h3>
				<code class="signature" v-html="signature"></code>
				<Description :description="process.description" :preprocessor="processReferenceParser" />
				<DeprecationNotice v-if="process.deprecated" entity="process" />
				<ExperimentalNotice v-if="process.experimental" entity="process" />
			</section>

			<section class="parameters">
				<h3>Parameters</h3>
				<ProcessParameter v-for="(param, i) in process.parameters" :key="i" :parameter="param" :processReferenceParser="processReferenceParser" />
				<p v-if="process.parameters.length === 0">This process has no parameters.</p>
			</section>

			<section class="returns">
				<h3>Return Value</h3>
				<Description v-if="process.returns.description" :description="process.returns.description" :preprocessor="processReferenceParser" />
				<div class="json-schema-container" v-if="process.returns.schema">
					<JsonSchema :schema="process.returns.schema" />
				</div>
			</section>

			<section class="exceptions" v-if="hasElements(process.exceptions)">
				<h3>Errors/Exceptions</h3>
				<ul>
					<li class="exception" v-for="(exception, name) in process.exceptions" :key="name">
						<code>{{ name }}</code>
						<span class="http-code" v-if="exception.http"> — HTTP {{ exception.http }}</span>
						<span class="error-code" v-if="exception.code"> — {{ exception.code }}</span>
						<Description v-if="exception.description" :description="exception.description" :preprocessor="processReferenceParser" :compact="true" />
						<div v-if="exception.message" class="message">Message: <em>{{ exception.message }}</em></div>
					</li>
				</ul>
			</section>

			<section class="examples" v-if="hasElements(process.examples)">
				<h3>Examples</h3>
				<ProcessExample v-for="(example, key) in process.examples" :key="key" :id="key" :example="example" :processId="process.id" :processParameters="process.parameters" :processReferenceParser="processReferenceParser" />
				<LinkList :links="exampleLinks" heading="Processes" headingTag="h4" />
			</section>

			<section class="links">
				<LinkList :links="process.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'example']" />
			</section>

			<slot name="process-after-details"></slot>

		</div>

	</div></article>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import ExperimentalNotice from './ExperimentalNotice.vue';
import JsonSchema from './JsonSchema.vue';
import LinkList from './LinkList.vue';
import ProcessExample from './ProcessExample.vue';
import ProcessParameter from './ProcessParameter.vue';
import Utils from '../utils.js';
import { MigrateProcesses } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'Process',
	mixins: [BaseMixin],
	components: {
		JsonSchema,
		DeprecationNotice,
		Description,
		ExperimentalNotice,
		ProcessExample,
		ProcessParameter,
		LinkList
	},
	props: {
		processData: Object,
		provideDownload: {
			type: Boolean,
			default: true
		},
		initiallyCollapsed: {
			type: Boolean,
			default: false
		},
		processReferenceBuilder: Function
	},
	data() {
		return {
			collapsed: false,
			process: {}
		}
	},
	watch: {
		processData() {
			this.updateData();
		}
	},
	computed: {
		signature(html = true) {
			let params = [];
			for(let i in this.process.parameters) {
				let p = this.process.parameters[i];
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
			let returns = Utils.dataType(this.process.returns.schema, true);
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
	beforeMount() {
		if (this.initiallyCollapsed) {
			this.collapsed = !this.collapsed;
		}
	},
	methods: {
		hasElements(data) {
			return (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
		},
		updateData() {
			this.process = MigrateProcesses.convertProcessToLatestSpec(this.processData, this.version);
		},
		toggle() {
			if (this.initiallyCollapsed) {
				this.collapsed = !this.collapsed;
			}
		},
		formatCategory(name) {
			return name.replace('_', ' ');
		},
		download() {
			let dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.processData, null, 2));
			let downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", this.process.id + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		},
		processReferenceParser(text) {
			if (typeof this.processReferenceBuilder !== 'function') {
				return text;
			}
			// Parse our extension to CommonMark, which allows linking to other processes with ``process()``
			return text.replace(/(^|[^\w`])``(\w+)\(\)``(?![\w`])/g, (_, prefix, pid) => {
				return prefix + this.processReferenceBuilder(pid);
			});
		}
	}
}
</script>

<style scoped>
.process-bar {
	display: flex;
	align-items: baseline;
}
.badges {
	margin-bottom: 0.75em;
}
.categories {
	flex: 3;
}
.actions {
	flex: 1;
	text-align: right;
}
.actions .action {
	background-color: chocolate;
}
strong.deprecated {
	color: red;
}
strong.experimental {
	color: blueviolet;
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
.process .signature {
	display: block;
	margin: 1em 0;
}
.links:empty {
	display: none;
}
</style>