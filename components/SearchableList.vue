<template>
	<div class="vue-component searchable-list">
		<template v-if="data.length === 0">
			<p>No data available.</p>
		</template>
		<template v-else>
			<div class="search-box" v-if="externalSearchTerm === null">
				<span class="icon">🔎</span>
				<input type="search" v-model="searchTerm" :placeholder="searchPlaceholder" />
			</div>
			<p v-if="noResults">No search results available.</p>
			<ul v-else class="list" :class="{expandable}">
				<li v-for="(summary, i) in summaries" :key="i" v-show="summary.show" :class="{expanded: showDetails[i] === true}">
					<summary @click="toggle(i)" class="summary">
						<slot name="summary" :summary="summary" :item="data[summary.index]">
							<strong>{{ summary.identifier }}</strong>
							<small :class="{hideOnExpand: hideSummaryOnExpand}">{{ summary.summary }}</small>
						</slot>
					</summary>
					<div class="details">
						<slot name="details" v-if="typeof showDetails[i] === 'boolean'" v-show="showDetails[i] === true"  :summary="summary" :item="data[summary.index]">
							No details available!
						</slot>
					</div>
				</li>
			</ul>
		</template>
	</div>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'SearchableList',
	props: {
		data: {
			type: Array | Object,
			default: () => ([])
		},
		identifierKey: {
			type: String,
			default: 'id'
		},
		summaryKey: {
			type: String,
			default: 'summary'
		},
		externalSearchTerm: {
			type: String,
			default: null
		},
		searchPlaceholder: {
			type: String,
			default: 'Search'
		},
		sort: {
			type: Boolean,
			default: true
		},
		allowExpand: {
			type: Boolean,
			default: true
		},
		hideSummaryOnExpand: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			searchTerm: '',
			showDetails: {}
		};
	},
	watch: {
		externalSearchTerm: {
			immediate: true,
			handler(value) {
				this.searchTerm = typeof value === 'string' ? value : '';
			}
		},
		searchTerm(value) {
			this.search(value);
		}
	},
	computed: {
		noResults() {
			return (this.searchTerm.length > 0 && typeof this.summaries.find(item => item.show === true) === 'undefined');
		},
		expandable() {
			return this.allowExpand && (!!this.$slots['details'] || !!this.$scopedSlots['details']);
		},
		summaries() {
			let summaries = [];
			for(let index in this.data) {
				let entry = this.data[index];
				let summary = {
					identifier: index,
					summary: '',
					show: true,
					index: index
				};

				if (typeof entry[this.identifierKey] === 'string') {
					summary.identifier = entry[this.identifierKey];
				}
				if (typeof entry[this.summaryKey] === 'string') {
					summary.summary = entry[this.summaryKey];
				}

				summaries.push(summary);
			}
			if (this.sort) {
				if (Utils.isObject(this.data)) {
					summaries = Object.values(summaries);
				}
				summaries.sort((a,b) => Utils.compareStringCaseInsensitive(a.identifier, b.identifier));
			}
			return summaries;
		}
	},
	methods: {
		toggle(id) {
			if (!this.expandable) {
				return;
			}
			this.$set(this.showDetails, id, !this.showDetails[id]);
		},
		search(value) {
			if (value.length >= 2) {
				this.summaries.forEach(item => {
					let searchable = (item.identifier + ' ' + item.summary).toLowerCase();
					let result = searchable.includes(this.searchTerm.toLowerCase());
					this.$set(item, 'show', result);
				});
			}
			else {
				this.summaries.forEach(item => this.$set(item, 'show', true));
			}
		}
	}
}
</script>

<style>
.vue-component.searchable-list .list .details h2,
.vue-component.searchable-list .list .details h3,
.vue-component.searchable-list .list .details h4,
.vue-component.searchable-list .list .details h5,
.vue-component.searchable-list .list .details h6 {
	font-size: 1em;
}
</style>

<style scoped>
.details  {
	display: none;
}
ul.list {
	margin-left: 0;
	padding-left: 0;
	list-style-type: none;
}
ul.list > li {
	margin-bottom: 0.5em;
}
ul.list > li > summary {
	margin-bottom: 0.5em;
	margin-left: 1em;
	line-height: 1.33em;
}
ul.list > li > summary strong {
	display: block;
	text-overflow: ellipsis;
    overflow: hidden;
}
ul.list > li > summary strong.inline {
    display: inline;
    overflow: auto;
}
ul.list > li > summary:before {
	content: "▸";
	margin-left: -1em;
	float: left;
	font-size: 1em;
}
ul.expandable > li > summary {
	cursor: pointer;
}
ul.expandable > li.expanded {
	margin-bottom: 2em;
}
ul.expandable > li.expanded .details {
	display: block;
	margin-left: 1em;
}
ul.expandable > li.expanded > summary .hideOnExpand {
	display: none;
}
ul.expandable > li.expanded > summary:before {
	content: "▾";
}

.search-box {
    margin: 0 1px 1em 0;
    position: relative;
}
.search-box input, .search-box .icon {
	height: 1.5em;
	font-size: 1em;
	margin: 0;
}
.search-box input {
    padding: 0.25em 0.3em;
    padding-left: 1.9em;
    z-index: 1;
	display: inline-block;
	border: 1px solid #ccc;
	box-sizing: content-box;
	background-color: #fff;
	width: calc(100% - 2.2em);
}
.search-box .icon {
    user-select: none;
    margin-top: 0.3em;
    margin-left: 0.3em;
    width: 1em;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
}
</style>