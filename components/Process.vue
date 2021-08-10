<template>
	<article class="vue-component process">

		<slot v-if="process.id" name="title" :v-bind="$props">
			<a class="anchor" :name="process.id"></a>
			<h2>
				{{ process.id }}
				<span class="namespace" v-if="displayableNamespace"> — {{ displayableNamespace }}</span>
			</h2>
		</slot>

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

		<template v-if="provideDownload || hasElements(process.categories)">
			<div class="process-bar">
				<ul class="badges categories" v-if="hasElements(process.categories)">
					<li class="badge category" v-for="value in process.categories" :key="value" v-text="formatCategory(value)"></li>
				</ul>
				<ul class="badges actions" v-if="provideDownload">
					<li class="badge action download"><a class="badge-fill" @click="download">Download JSON</a></li>
				</ul>
			</div>
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
			<ProcessParameter v-for="param in parameters" :key="param.name" :parameter="param" :processUrl="processUrl" />
			<p v-if="parameters.length === 0">This process has no parameters.</p>
		</section>

		<section class="returns">
			<h3>Return Value</h3>
			<template v-if="returns.description || returns.schema">
				<Description v-if="returns.description" :description="returns.description" :processUrl="processUrl" />
				<div class="json-schema-container" v-if="returns.schema">
					<JsonSchema :schema="returns.schema" />
				</div>
			</template>
			<p v-else>The return value has not been defined.</p>
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
			<ProcessExample v-for="(example, key) in process.examples" :key="key" :id="key" :example="example" :processId="id" :processParameters="parameters" :processUrl="processUrl" />
			<LinkList :links="exampleLinks" heading="Processes" headingTag="h4" />
		</section>

		<section class="links">
			<LinkList :links="process.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'example']" />
		</section>

		<section class="process-graph" v-if="showGraph && process.process_graph">
			<h3>Processing Instructions</h3>
			<div class="graph">
				<slot name="process-graph" :v-bind="$props">
					<ModelBuilder :id="id" :value="process" />
				</slot>
			</div>
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
		ModelBuilder: () => import('./ModelBuilder.vue'),
		ProcessExample,
		ProcessParameter: () => import('./internal/ProcessParameter.vue'),
		LinkList: () => import('./LinkList.vue')
	},
	props: {
		process: {
			type: Object,
			default: () => ({})
		},
		namespace: {
			type: String,
			default: null
		},
		provideDownload: {
			type: Boolean,
			default: true
		},
		processUrl: String,
		showGraph: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		displayableNamespace() {
			let namespace = this.process.namespace || this.namespace;
			if (namespace === 'backend') {
				return '';
			}
			else if (namespace === 'user') {
				return 'user-defined';
			}
			else {
				return namespace;
			}
		},
		id() {
			return this.process.id || 'unnamed';
		},
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
			return Utils.formatProcessSignature(this, html);
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
			downloadAnchorNode.setAttribute("download", this.id + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.process {
	.namespace {
		font-weight: normal;
		color: #aaa;
	}
	.process-bar {
		display: flex;
		align-items: baseline;
	}
	.badges {
		margin-top: 0.75em;
	}
	.categories {
		flex: 1;
	}
	.actions {
		text-align: right;
		.action {
			background-color: chocolate;

			&:hover {
				background-color: black;
			}
		}
	}
	strong {
		&.deprecated {
			color: red;
		}
		&.experimental {
			color: blueviolet;
		}
	}
	.exception {
		margin-top: 0.5em;
		code {
			font-weight: bold;
		}
		.styled-description {
			margin: 0.5em 0;
		}
		.message {
			margin: 0.5em 0;
			font-size: 0.8em;
		}
	}
	.signature {
		display: block;
		margin: 1em 0;
	}
	.process-graph .graph {
		max-width: 100%;
		height: 300px;
		border: 1px solid #ccc;

		 > .object-tree > ul {
			margin: 0;
			padding: 0;
		}
	}
	.links:empty {
		display: none;
	}
}
</style>