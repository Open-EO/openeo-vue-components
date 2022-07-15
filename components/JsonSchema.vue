<template>
	<div class="vue-component json-schema" v-if="showSchema">
		<template v-if="visible">
			<div v-if="isProcessGraph" class="schemaProcessGraph">
				<div class="process-graph-parameters">
					<p class="schema-attrs">{{ formatKey('type') }}: <span class="data-type">User-defined Process (process-graph:object)</span></p>
					<p class="schema-attrs" title="The parameters that can be used in the process.">
						<strong>Parameters:</strong>
					</p>
					<template v-if="hasParameters">
						<ProcessParameter v-for="(param, i) in schema.parameters" :key="i" :parameter="param" :processUrl="processUrl" />
					</template>
					<p v-else>No parameters defined.</p>
					<p class="schema-attrs" title="Describes what must be returned by the process.">
						<strong>Expected Return Value:</strong>
					</p>
					<template v-if="hasReturns">
						<Description v-if="schema.returns.description" :description="schema.returns.description" :processUrl="processUrl" />
						<div class="json-schema-container" v-if="schema.returns.schema">
							<openeo-json-schema :schema="schema.returns.schema" />
						</div>
					</template>
					<p v-else>No constraints defined.</p>
				</div>
			</div>
			<div v-else-if="showRow('object')" class="schemaObjectElement">
				<div class="inline-schema-attrs">
					<openeo-json-schema v-if="filteredObjectSchema !== null" :schema="filteredObjectSchema" :nestingLevel="nestingLevel+1" />
					<table class="object-properties">
						<tr>
							<th colspan="2" class="object-prop-heading">Object Properties:</th>
						</tr>
						<tr v-for="(val, key) in schema.properties" :key="key">
							<td class="key">
								{{ key }}
								<strong class="required" v-if="schema.required && schema.required.indexOf(key) !== -1" title="required">*</strong>
							</td>
							<td class="value">
								<openeo-json-schema :schema="val" :nestingLevel="nestingLevel+1" :processUrl="processUrl" />
							</td>
						</tr>
					</table>
				</div>
			</div>
			<table v-else class="schema-attrs">
				<tr v-if="typeof schema.title == 'string'">
					<td colspan="2"><strong>{{ schema.title }}</strong></td>
				</tr>
				<tr v-if="typeof schema.description == 'string'">
					<td colspan="2"><Description :description="schema.description" :compact="true" /></td>
				</tr>
				<tr v-if="showAnyType">
					<td class="key">{{ formatKey('type') }}:</td>
					<td class="value data-type">any</td>
				</tr>
				<template v-else-if="compositeTypes.length > 1">
					<tr>
						<th colspan="2" class="data-types-heading">Data Types:</th>
					</tr>
					<tr>
						<td colspan="2" class="schema-container data-types-container">
							<openeo-json-schema v-for="(v, k) in compositeTypes" :key="k" :schema="v" :nestingLevel="nestingLevel+1" :processUrl="processUrl" />
						</td>
					</tr>
				</template>
				<template v-if="!Array.isArray(this.schema)">
					<template v-for="(val, key) in schema">
						<tr :key="key" v-if="typeof val !== 'undefined' && showRow(key)">
							<td class="key">{{ formatKey(key) }}:</td>
							<td class="value">
								<span v-if="key == 'type'" class="data-type">{{ formatType() }}</span>
								<div v-else-if="key == 'allOf' && Array.isArray(val)" class="schema-container">
									<openeo-json-schema v-for="(v, k) in val" :key="k" :schema="v" :nestingLevel="nestingLevel+1" :processUrl="processUrl" />
								</div>
								<span v-else-if="key != 'default' && key != 'examples' && val === true" title="true">✓ Yes</span>
								<span v-else-if="key != 'default' && key != 'examples' && val === false" title="false">✕ No</span>
								<ul v-else-if="key != 'examples' && Array.isArray(val)" class="comma-separated-list">
									<li v-for="(v, k) in val" :key="k">{{ v }}</li>
								</ul>
								<ul v-else-if="key == 'examples' && Array.isArray(val) && val.length > 1">
									<li v-for="(v, k) in val" :key="k"><code>{{ v }}</code></li>
								</ul>
								<code v-else-if="key == 'examples' && Array.isArray(val) && val.length === 1">{{ val[0] }}</code>
								<Description v-else-if="key == 'description'" :description="val" :compact="true" />
								<em v-else-if="key == 'default' && val === ''">Empty string</em>
								<code v-else-if="key == 'default' && (typeof val === 'object' || typeof val === 'boolean')">{{ JSON.stringify(val) }}</code>
								<code v-else-if="key == 'pattern'">{{ val | regex }}</code>
								<openeo-json-schema v-else-if="typeof val === 'object'" :schema="val" :initShown="nestingLevel < 3" :nestingLevel="nestingLevel+1" :processUrl="processUrl" />
								<span v-else>{{ val }}</span>
							</td>
						</tr>
					</template>
				</template>
			</table>
		</template>
		<div class="schema-expand" v-else><a @click="show()">> ...</a></div>
	</div>
</template>

<script>
import Utils from '../utils.js';

export default {
	name: 'JsonSchema',
	components: {
		Description: () => import('./Description.vue'),
		// Workaround for issue https://github.com/vuejs/vue-cli/issues/6225
		'openeo-json-schema': () => import('./JsonSchema.vue')
	},
	props: {
		schema: {
			type: [Object, Array],
			default: () => ({})
		},
		initShown: {
			type: Boolean,
			default: true
		},
		nestingLevel: {
			type: Number,
			default: 1
		},
		processUrl: String
	},
	data() {
		return {
			visible: this.initShown,
			filteredObjectSchema: null
		};
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
		// Circular dependency leads to errors when building with target wc(-async)
		// See https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
		this.$options.components.ProcessParameter = require('./internal/ProcessParameter.vue').default;
	},
	filters: {
		regex(value) {
			return value.replaceAll("\r", "\\r").replaceAll("\n", "\\n").replaceAll("\t", "\\t");
		}
	},
	computed: {
		showSchema() {
			return typeof this.schema === 'object' && this.schema !== null && this.nestingLevel < 20;
		},
		showAnyType() {
			return Utils.isObject(this.schema) && typeof this.schema.type === 'undefined' && typeof this.schema.subtype === 'undefined';
		},
		isProcessGraph() {
			return (this.schema.type === 'object' && this.schema.subtype === 'process-graph');
		},
		compositeTypes() {
			if (Array.isArray(this.schema)) {
				return this.schema;
			}
			else if (Array.isArray(this.schema.anyOf)) {
				return this.schema.anyOf;
			}
			else if (Array.isArray(this.schema.oneOf)) {
				return this.schema.oneOf;
			}
			return [this.schema];
		},
		hasReturns() {
			return this.isProcessGraph && Utils.isObject(this.schema.returns);
		},
		hasParameters() {
			return this.isProcessGraph && Array.isArray(this.schema.parameters) && this.schema.parameters.length > 0;
		}
	},
	watch: {
		initShown(newVal) {
			this.visible = newVal;
		},
		schema: {
			immediate: true,
			handler(newSchema) {
				var filtered = null;
				for(var key in newSchema) {
					if (key == 'required' || key == 'properties' || key == 'parameters' || key === 'returns') {
						continue;
					}
					if (filtered === null) {
						filtered = {};
					}
					filtered[key] = newSchema[key];
				}
				this.filteredObjectSchema = filtered;
				this.visible = this.initShown;
			}
		}
	},
	methods: {
		show() {
			this.visible = true;
		},
		formatKey(key) {
			switch(key) {
				case 'items':
					return 'Array items';
				case 'minItems':
					return 'Min. number of items';
				case 'const':
					return 'Constant value';
				case 'maxItems':
					return 'Max. number of items';
				case 'minimum':
					return 'Minimum value (inclusive)';
				case 'maximum':
					return 'Maximum value (inclusive)';
				case 'exclusiveMinimum':
					return 'Minimum value (exclusive)';
				case 'exclusiveMinimum':
					return 'Maximum value (exclusive)';
				case 'enum':
					return 'Allowed values';
				case 'default':
					return 'Default value';
				case 'type':
					return 'Data type';
				case 'allOf':
					return 'Composite data type';
				case 'contentMediaType':
					return 'Media Type';
				case 'contentEncoding':
					return 'Encoding';
				case 'deprecated':
					return 'Deprecated';
				case 'additionalProperties':
					return "Each property";
				default:
					if (key.length > 1) {
						return Utils.prettifyString(key);
					}
			}
			return key;
		},
		formatType(schema) {
			if (typeof schema === 'undefined') {
				schema = this.schema;
			}
			return Utils.dataType(schema);
		},
		showRow(key) {
			if (key == 'object') {
				return (this.schema.type == 'object' && typeof this.schema.properties == 'object');
			}
			else if (key == 'title' || key == 'description' || key == 'subtype' || key == 'format' || key == 'anyOf' || key == 'oneOf' || key == 'federation:backends') {
				return false;
			}
			else if (key == 'items' && Object.keys(this.schema.items).length === 1 && typeof this.schema.items.type !== 'undefined') {
				// If items hold only the type (is added to type anyway)
				return false;
			}

			return true;
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.json-schema {
	border-left: 7px solid #ccc;
	border-bottom: 1px dotted #ccc;
	padding: 0.25%;
	width: 99%;

	td, th {
		padding: 0.25em;
	}
	.schemaProcessGraph {
		padding: 0.25em;

		h4 {
			font-size: 1.1em;
			margin-top: 1em;
		}
	}
	.data-type {
		font-weight: bold;
	}
	.data-types-container > .json-schema {
		border-left: 1px solid #ccc;
		border-bottom: 1px dotted #ccc;
		margin-top: 0.5em;
		margin-left: 1em;
	}
	.inline-schema-attrs .json-schema {
		border: 0;
		padding: 0;
		width: 100%;
		background-color: transparent;
	}
	.schema-name {
		display: inline-block;
		border-bottom: 1px dotted black;
	}
	.schema-attrs {
		width: 100%;

		.key {
			white-space: nowrap;
		}
		.value {
			width: 90%;
		}

		> tr > td > .styled-description {
			margin-bottom: 1em;
		}
	}
	p.schema-attrs {
		margin: 1em 0 0.5em 0;
		
		&:first-of-type {
			margin: 0 0 1em 0;
		}
	}
	.object-prop-heading,
	.data-types-heading {
		text-align: left;
	}
	.object-properties {
		> tr {
			> .key {
				font-style: italic;
				font-weight: bold;
				min-width: 80px;
				width: 8%;
				vertical-align: top;
				padding-top: 0.75em;
				padding-left: 1em;
			}

			> .value {
				border-bottom: 1px dotted #ccc;
			}
		}
		> tr:last-of-type {
			> .value {
				border-bottom: 0;
			}
		}
		> th {
			padding-top: 1em;
		}
	}
}
</style>