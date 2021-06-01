<template>
	<section class="vue-component stac stac-fields metadata">
		<template v-for="group in fields">
			<component :is="headingTag" v-html="group.label" :key="group.extension" />
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
									<td v-for="col in prop.itemOrder" :key="col" v-html="row[col]" />
								</tr>
							</tbody>
						</table>
						<Process v-else-if="field === 'card4l:processing_chain'" class="inline" :process="prop.value" :provideDownload="false" :showGraph="true" />
						<div class="formatted" v-else-if="prop.formatted" v-html="prop.formatted" />
						<template v-else>{{ prop.value }}</template>
					</slot>
				</div>
			</div>
		</template>
	</section>
</template>

<script>
import StacFields from '@radiantearth/stac-fields';
import StacMigrate from '@radiantearth/stac-migrate';

StacFields.Registry.externalRenderer = true;
StacFields.Registry.addMetadataFields({
	"eo:platform": {
		alias: "platform"
	},
	"eo:instrument": {
		alias: "instruments"
	},
	"gee:type": {
		label: "Collection Type",
		formatter: StacFields.label
	}
});

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
		}
	},
	computed: {
		ignoreFn() {
			if (this.ignore.length > 0) {
				return key => !this.ignore.includes(key);
			}
			return null;
		},
		isCollection() {
			return (this.metadata.type !== 'Feature');

		},
		fields() {
			let data = JSON.parse(JSON.stringify(this.metadata));
			if (this.isCollection) {
				data = StacMigrate.collection(data);
				for(let key in data) {
					// Copy all custom top-level fields to summaries for easier visualization
					if (key === 'version' || (key !== 'cube:dimensions' && key.includes(':'))) {
						data.summaries[key] = [data[key]];
					}
				}
				return StacFields.formatSummaries(data, this.ignoreFn);
			}
			else {
				return StacFields.formatItemProperties(StacMigrate.item(data), this.ignoreFn);
			}
		}
	},
	methods: {
		normalize(data) {
			if (this.isCollection) {
				return data;
			}
			else {
				return [data];
			}
		},
		label(key, specs = {}) {
			return StacFields.label(key, specs);
		}
	}
}
</script>

<style>
@import url('../base.css');

.vue-component.stac-fields .unit {
	opacity: 0.6;
}
.vue-component.stac-fields .table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.9em;
}
.vue-component.stac-fields .table th {
	text-align: left;
	background-color: rgba(0, 0, 0, 0.05);
}
.vue-component.stac-fields .table td,
.vue-component.stac-fields .table th {
	border: 1px solid rgba(0, 0, 0, 0.2);
	padding: 3px;
}
.vue-component.stac-fields .table td {
	vertical-align: top;
}
.vue-component.stac-fields .descrption p:first-of-type {
	margin-top: 0;
}
.vue-component.stac-fields .descrption p:last-of-type {
	margin-bottom: 0;
}
.vue-component.stac-fields .table tbody tr:hover, .vue-component.stac-fields .table tbody tr:hover th {
	background-color: rgba(0, 0, 0, 0.1);
}
</style>