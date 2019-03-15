<template>
	<div class="vue-component json-schema" v-if="typeof schema === 'object' && schema !== null && nestingLevel < 100">
		<template v-if="visible">
			<div v-if="showRow('object')" class="schemaObjectElement">
				<div v-if="filteredObjectSchema !== null" class="inline-schema-attrs">
					<JsonSchema :schema="filteredObjectSchema" :nestingLevel="nestingLevel+1" />
				</div>
				<table class="object-properties">
					<tr>
						<th colspan="2" class="object-prop-heading">
							<template v-if="schema.parameters">Callback parameters:</template>
							<template v-else>Object Properties:</template>
						</th>
					</tr>
					<tr v-for="(val, key) in (schema.properties || schema.parameters)" :key="key">
						<td class="propKey">
							{{ key }}
							<strong class="required" v-if="schema.required && schema.required.indexOf(key) !== -1" title="required">*</strong>
						</td>
						<td class="value">
							<JsonSchema :schema="val" :nestingLevel="nestingLevel+1" />
						</td>
					</tr>
				</table>
			</div>
			<table v-else class="schema-attrs">
				<tr v-if="typeof schema.title == 'string'">
					<td colspan="2"><strong>{{ schema.title }}</strong></td>
				</tr>
				<tr v-if="typeof schema.description == 'string'">
					<td colspan="2"><Description :description="schema.description" :compact="true" /></td>
				</tr>
				<tr v-if="showAnyType()">
					<td class="key">{{ formatKey('type') }}:</td>
					<td class="value data-type">any</td>
				</tr>
				<tr v-for="(val, key) in schema" :key="key">
					<template v-if="showRow(key)">
						<td class="key">{{ formatKey(key) }}:</td>
						<td class="value">
							<span v-if="key == 'type'" class="data-type">{{ formatType() }}</span>
							<div v-else-if="(key == 'oneOf' || key == 'anyOf' || key == 'allOf') && Array.isArray(val)" class="schema-container">
								<JsonSchema v-for="(v, k) in val" :key="k" :schema="v" :nestingLevel="nestingLevel+1" />
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
							<code v-else-if="key == 'pattern'">{{ val }}</code>
							<JsonSchema v-else-if="typeof val === 'object'" :schema="val" :initShown="nestingLevel < 3" :nestingLevel="nestingLevel+1" />
							<span v-else>{{ val }}</span>
						</td>
					</template>
				</tr>
			</table>
		</template>
		<div class="schema-expand" v-else><a @click="show()">> ...</a></div>
	</div>
</template>

<script>
import Description from './Description.vue';
import Utils from '../utils.js';
import './base.css';

export default {
	name: 'JsonSchema',
	props: {
		schema: Object,
		initShown: {
			type: Boolean,
			default: true
		},
		nestingLevel: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			visible: this.initShown,
			filteredObjectSchema: null
		};
	},
	components: {
		Description
	},
	created() {
        this.updateData();
	},
	watch: {
		initShown(newVal, oldVal) {
			this.visible = newVal;
		},
		schema() {
			this.updateData();
		}
	},
	methods: {
		updateData() {
			var filtered = null;
			for(var key in this.schema) {
				if (key == 'required' || key == 'properties' || key == 'parameters') {
					continue;
				}
				if (filtered === null) {
					filtered = {};
				}
				filtered[key] = this.schema[key];
			}
			this.filteredObjectSchema = filtered;
		},
		show() {
			this.visible = true;
		},
		formatKey(key) {
			switch(key) {
				case 'items':
					key = 'Array items';
					break;
				case 'minItems':
					key = 'Min. number of items';
					break;
				case 'const':
					key = 'Constant value';
					break;
				case 'maxItems':
					key = 'Max. number of items';
					break;
				case 'minimum':
					key = 'Minimum value (inclusive)';
					break;
				case 'maximum':
					key = 'Maximum value (inclusive)';
					break;
				case 'exclusiveMinimum':
					key = 'Minimum value (exclusive)';
					break;
				case 'exclusiveMinimum':
					key = 'Maximum value (exclusive)';
					break;
				case 'enum':
					key = 'Allowed values';
					break;
				case 'default':
					key = 'Default value';
					break;
				case 'type':
					key = 'Data type';
					break;
				case 'oneOf':
				case 'anyOf':
					key = 'Data types';
					break;
				default:
					if (key.length > 1) {
						key = key.charAt(0).toUpperCase() + key.slice(1);
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
				return (this.schema.type == 'object' && (typeof this.schema.properties == 'object' || typeof this.schema.parameters == 'object'));
			}
			else if (key == 'title' || key == 'description' || key == 'format') {
				return false;
			}
			else if (key == 'items' && Object.keys(this.schema.items).length === 1 && typeof this.schema.items.type !== 'undefined') {
				// If items hold only the type (is added to type anyway)
				return false;
			}

			return true;
		},
		showAnyType() {
			return Utils.isAnyType(this.schema);
		}
	}
}
</script>

<style scoped>
.json-schema {
	border-left: 7px solid #ccc;
	border-bottom: 1px dotted #ccc;
	padding: 0.25%;
	width: 99%;
}
.json-schema td {
	padding: 0.25em;
}
.inline-schema-attrs .json-schema {
	border: 0;
}
.schema-name {
	display: inline-block;
	border-bottom: 1px dotted black;
}
.schema-attrs {
	width: 100%;
}
.schema-attrs .key {
	min-width: 8em;
	width: 18%;
}
.schema-attrs .value {
	width: 82%;
}

.inline-schema-attrs .json-schema {
	background-color: transparent;
}
.object-prop-heading {
	padding: 0.5em;
	text-align: left;
}
.object-properties .propKey {
	font-style: italic;
	font-weight: bold;
	min-width: 80px;
	width: 8%;
}
.object-properties th {
	padding-top: 1em;
}
</style>