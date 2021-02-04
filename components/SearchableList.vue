<template>
	<div class="vue-component searchable-list" :class="{expandable: collapsed !== null, expanded: showList, noResults: filteredCount === 0}">
		<slot name="heading" :filteredCount="filteredCount" :totalCount="totalCount">
			<h2 v-if="heading" class="heading" @click="toggleHeading(null)">
				{{ heading }}
				<template v-if="filteredCount !== null">({{ filteredCount }}/{{ totalCount }})</template>
				<template v-else>({{ totalCount }})</template>
			</h2>
		</slot>
		<div class="body" v-if="showList !== null" v-show="showList === true">
			<template v-if="totalCount === 0">
				<p>No data available.</p>
			</template>
			<template v-else>
				<SearchBox v-if="externalSearchTerm === null" v-model="searchTerm" :placeholder="searchPlaceholder" :minLength="searchMinLength" />
				<p v-if="filteredCount === 0">No search results found.</p>
				<ul v-else class="list" :class="{expandable: offerDetails}">
					<li v-for="(summary, i) in summaries" :key="i" v-show="summary.show" :class="{expanded: showDetails[i]}">
						<summary @click="toggleDetails(i)" class="summary" :class="{experimental: summary.experimental, deprecated: summary.deprecated}">
							<slot name="summary" :summary="summary" :item="data[summary.index]">
								<strong>{{ summary.identifier }}</strong>
								<small v-if="summary.summary" :class="{hideOnExpand: !showSummaryOnExpand}">{{ summary.summary }}</small>
							</slot>
						</summary>
						<div class="details" v-if="typeof showDetails[i] === 'boolean'" v-show="showDetails[i] === true">
							<slot name="details" :summary="summary" :item="data[summary.index]">
								No details available!
							</slot>
						</div>
					</li>
				</ul>
			</template>
		</div>
	</div>
</template>

<script>
import Utils from '../utils';
import Vue from 'vue';

export default {
	name: 'SearchableList',
	components: {
		SearchBox: () => import(/* webpackChunkName: "search-box" */'./SearchBox.vue')
	},
	props: {
		data: {
			type: [Array, Object],
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
		offerDetails: {
			type: Boolean,
			default: true
		},
		showSummaryOnExpand: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: null
		},
		collapsed: {
			type: Boolean,
			default: null
		},
		searchMinLength:{
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			searchTerm: '',
			// For showDetails / showList the following states are possible:
			// null = if allowed to collapse, null indicates it is collapsed and has not been expanded yet
			// false = collapsed, but has been expanded before
			// true = expanded
			// This allows with a combination of v-if and v-show to not render by default (=> null), but keep rendered versions in cache (=> false)
			showDetails: {},
			showList: this.collapsed ? null : true
		};
	},
	watch: {
		externalSearchTerm: {
			immediate: true,
			handler(value) {
				this.searchTerm = typeof value === 'string' ? value : '';
			}
		},
		searchTerm: {
			immediate: true,
			handler(value) {
				if (value.length >= this.searchMinLength) {
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
		},
		collapsed(newState) {
			if (newState === false) {
				this.showList = true;
			}
			else if (this.showList !== null) {
				this.showList = false;
			}
			// else: Leave state as it is: null => don't render anything yet until expanded for the first time {
		}
	},
	computed: {
		totalCount() {
			return Utils.size(this.data);
		},
		filteredCount() {
			if (this.searchTerm.length >= this.searchMinLength) {
				return this.summaries.filter(item => item.show === true).length;
			}
			return null;
		},
		summaries() {
			let summaries = [];
			for(let index in this.data) {
				let entry = this.data[index];
				let summary = {
					identifier: index,
					summary: '',
					show: true,
					index: index,
					experimental: entry.experimental,
					deprecated: entry.deprecated
				};

				if (typeof entry[this.identifierKey] === 'string') {
					summary.identifier = entry[this.identifierKey];
				}
				if (typeof entry[this.summaryKey] === 'string') {
					summary.summary = entry[this.summaryKey];
				}

				summaries.push(Vue.observable(summary));
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
		toggleHeading(show = null) {
			if (this.collapsed === null) {
				return;
			}
			this.showList = show === null ? !this.showList : show;
			this.$emit('headingToggled', this.showList);
			if (this.$parent) {
				this.$parent.$emit('headingToggled', this.showList);
			}
		},
		toggleDetails(id) {
			if (!this.offerDetails) {
				return;
			}
			let newState = !this.showDetails[id];
			this.$set(this.showDetails, id, newState);
			this.$emit('detailsToggled', newState, id);
			if (this.$parent) {
				this.$parent.$emit('detailsToggled', newState, id);
			}
		}
	}
}
</script>

<style>
.vue-component.expandable .heading {
	cursor: pointer;
	padding-left: 1em;
}
.vue-component.expandable .heading:before {
	content: "▸";
	margin-left: -1em;
	float: left;
	font-size: 1em;
}
.vue-component.expandable.expanded .heading:before {
	content: "▾";
}

.vue-component.searchable-list .details  {
	display: none;
}
.vue-component.searchable-list .list .details h2,
.vue-component.searchable-list .list .details h3,
.vue-component.searchable-list .list .details h4,
.vue-component.searchable-list .list .details h5,
.vue-component.searchable-list .list .details h6 {
	font-size: 1em;
}
.vue-component.searchable-list ul.list {
	margin-left: 0;
	padding-left: 0;
	list-style-type: none;
}
.vue-component.searchable-list ul.list > li {
	margin-bottom: 0.5em;
}
.vue-component.searchable-list ul.list > li > summary {
	margin-bottom: 0.5em;
	margin-left: 1em;
	line-height: 1.33em;
}
.vue-component.searchable-list ul.list > li > summary strong {
	display: block;
	text-overflow: ellipsis;
    overflow: hidden;
}
.vue-component.searchable-list ul.list > li > summary strong.inline {
    display: inline;
    overflow: auto;
}
.vue-component.searchable-list ul.list > li > summary.experimental strong {
	color: blueviolet;
}
.vue-component.searchable-list ul.list > li > summary.deprecated strong {
	text-decoration: line-through;
}
.vue-component.searchable-list ul.list > li > summary:before {
	content: "▸";
	margin-left: -1em;
	float: left;
	font-size: 1em;
}
.vue-component.searchable-list ul.expandable > li > summary {
	cursor: pointer;
}
.vue-component.searchable-list ul.expandable > li.expanded {
	margin-bottom: 2em;
}
.vue-component.searchable-list ul.expandable > li.expanded .details {
	display: block;
	margin-left: 1em;
}
.vue-component.searchable-list ul.expandable > li.expanded > summary .hideOnExpand {
	display: none;
}
.vue-component.searchable-list ul.expandable > li.expanded > summary:before {
	content: "▾";
}
</style>