<template>
	<section class="vue-component stac stac-fields metadata">
		<template v-for="group in fields">
			<component :is="headingTag" v-html="group.label || 'General'" :key="group.extension" />
			<section class="group" :key="`section_${group.extension}`">
				<div v-for="(prop, field) in group.properties" :key="group.extension + field" :id="'field_' + field" class="tabular" :class="{wrap: Boolean(prop.custom || prop.items)}">
					<label :title="field" v-html="prop.label" />
					<div class="value">
						<slot :name="field" :prop="prop" :field="field">
							<table v-if="prop.items" class="table">
								<thead>
									<tr>
										<th v-if="!Array.isArray(prop.formatted)">&nbsp;</th>
										<th v-for="col in prop.itemOrder" :key="col" v-html="prop.items[col].label"></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(row, r) in prop.formatted" :key="r">
										<th v-if="!Array.isArray(prop.formatted)">{{ r }}</th>
										<td v-for="col in prop.itemOrder" :key="`${col}_${r}`" v-html="row[col]" />
									</tr>
								</tbody>
							</table>
							<Process v-else-if="field === 'card4l:processing_chain'" class="inline" :process="prop.value" :provideDownload="false" :showGraph="true" />
							<div class="formatted" v-else-if="prop.formatted" v-html="prop.formatted" />
							<template v-else>{{ prop.value }}</template>
						</slot>
					</div>
				</div>
			</section>
		</template>
	</section>
</template>

<script>
import StacFields from '@radiantearth/stac-fields';
import Utils from '../../utils'

StacFields.Registry.externalRenderer = true;
//StacFields.Registry.addMetadataFields({});

export default {
	name: 'StacFields',
	components: {
		Process: () => import('../Process.vue')
	},
	props: {
		metadata: {
			type: Object,
			default: () => ({})
		},
		headingTag: {
			type: String,
			default: 'h3'
		},
		ignore: {
			type: Array,
			default: () => ([])
		},
		type: {
			type: String,
			required: true
		},
		context: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		ignoreFn() {
			if (this.ignore.length > 0) {
				return key => !this.ignore.includes(key);
			}
			return null;
		},
		fields() {
			if (this.type === 'Collection') {
				let data = Utils.deepClone(this.metadata);
				if (!Utils.isObject(data.summaries)) {
					data.summaries = {};
				}
				for(let key in data) {
					// Copy all custom top-level fields to summaries for easier visualization
					if (key === 'version' || (key !== 'cube:dimensions' && key.includes(':'))) {
						data.summaries[key] = [data[key]];
					}
				}
				return StacFields.formatSummaries(data, this.ignoreFn);
			}
			else if (this.type === 'Item') {
				return StacFields.formatItemProperties(this.metadata, this.ignoreFn);
			}
			else if (this.type === 'Asset') {
				return StacFields.formatAsset(this.metadata, this.context, this.ignoreFn);
			}
			else {
				throw new Error('Not implemented yet');
			}
		}
	},
	methods: {
		label(key, specs = {}) {
			return StacFields.label(key, specs);
		}
	}
}
</script>

<style lang="scss">
@import '../base.scss';
.vue-component.stac-fields {
	> .group {
		margin-left: 1em;
	}
	.table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9em;

		th {
			text-align: left;
			background-color: rgba(0, 0, 0, 0.05);
		}
		td, th {
			border: 1px solid rgba(0, 0, 0, 0.2);
			padding: 3px;
		}
		td {
			vertical-align: top;
		}
		tbody tr:hover,
		tbody tr:hover th {
			background-color: rgba(0, 0, 0, 0.1);
		}
	}
	.description {
		p {
			&:first-of-type {
				margin-top: 0;
			}
			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}
}
</style>