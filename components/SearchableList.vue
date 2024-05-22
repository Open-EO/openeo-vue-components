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
			<slot name="content-start"></slot>
			<template v-if="totalCount === 0">
				<p>No data available.</p>
			</template>
			<template v-else>
				<section class="action-bar">
					<SearchBox v-if="externalSearchTerm === null" v-model="searchTerm" :placeholder="searchPlaceholder" :minLength="searchMinLength" />
					<label class="deprecated" title="Show deprecated elements?">
						<input type="checkbox" v-model="hideDeprecated" :true-value="false" :false-value="true">
						Show deprecated
					</label>
				</section>
				<slot name="after-search-box" :filteredCount="filteredCount" :summaries="summaries"></slot>
				<p v-if="filteredCount === 0">No search results found.</p>
				<ul v-else class="list" :class="{expandable: offerDetails}">
					<li v-for="(summary, i) in summaries" :key="summary.identifier" v-show="summary.show" :class="{expanded: showDetails[i]}">
						<summary @click="toggleDetails(i)" class="summary" :class="{experimental: summary.experimental, deprecated: summary.deprecated}">
							<slot name="summary" :summary="summary" :item="summary.data">
								<strong>
									{{ summary.identifier }}
									<span v-if="allowCopy && canCopy" class="copy" @click.prevent.stop="copyIdentifier($event, summary)" title="Copy identifier">📋</span>
								</strong>
								<small v-if="summary.summary" :class="{hideOnExpand: !showSummaryOnExpand}">{{ summary.summary }}</small>
								<ul v-if="showKeywords && summary.keywords.length > 0" class="badges small block hideOnExpand">
									<li v-for="keyword in summary.keywords" :key="keyword" class="badge">{{ keyword }}</li>
								</ul>
							</slot>
						</summary>
						<div class="details" v-if="typeof showDetails[i] === 'boolean'" v-show="showDetails[i] === true">
							<Loading v-if="!summary.loaded" />
							<slot v-else name="details" :summary="summary" :item="summary.data">
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
import Loading from './internal/Loading.vue';
import Vue from 'vue';

export default {
	name: 'SearchableList',
	components: {
		Loading,
		SearchBox: () => import('./SearchBox.vue')
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
		keywordsKey: {
			type: String,
			default: null
		},
		showKeywords: {
			type: Boolean,
			default: false
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
		searchMinLength: {
			type: Number,
			default: 2
		},
		loadAdditionalData: {
			type: Function,
			default: null
		},
		allowCopy: {
			type: Boolean,
			default: false
		},
		hideDeprecatedByDefault: {
			type: Boolean,
			default: false
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
			showList: this.collapsed ? null : true,
			hideDeprecated: this.hideDeprecatedByDefault,
			summaries: [],
			canCopy: false
		};
	},
	watch: {
		loadAdditionalData: {
			handler() {
				this.generateSummaries(this.summaries);
			}
		},
		data: {
			immediate: true,
			handler(data, oldData) {
				// Don't re-generate summaries if the same object (in memory) has been passed.
				// We don't need to re-generate if just a random child has been updated, e.g. in detailsToggled.
				// Thus the check with === instead of deepEquals or so.
				if (data === oldData) {
					return;
				}
				this.generateSummaries(data);
			}
		},
		externalSearchTerm: {
			immediate: true,
			handler(value) {
				this.searchTerm = typeof value === 'string' ? value : '';
			}
		},
		summaries: {
			immediate: true,
			handler() {
				this.$emit('summaries', this.summaries);
			}
		},
		searchTerm() {
			this.filter();
		},
		hideDeprecated() {
			this.filter();
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
			if (this.hasActiveFilter()) {
				return this.summaries.filter(item => item.show === true).length;
			}
			return null;
		}
	},
	created() {
		this.filter();
	},
	mounted() {
		this.canCopy = navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
	},
	methods: {
		hasActiveFilter() {
			return this.searchTerm.length >= this.searchMinLength || this.hideDeprecated;
		},
		filter() {
			const doSearch = this.searchTerm.length >= this.searchMinLength;
			this.summaries.forEach(item => {
				let show = true;
				if (this.hideDeprecated && item.deprecated) {
					show = false;
				}
				else if (doSearch) {
					show = Utils.search(this.searchTerm, [item.identifier, item.summary].concat(item.keywords))
				}
				this.$set(item, 'show', show);
			});
			this.$emit('summaries', this.summaries);
		},
		copyIdentifier(event, summary) {
			if (this.allowCopy && this.canCopy) {
				let elem = event.composedPath()[0]; // event.target doesn't work in web components
				navigator.clipboard.writeText(summary.identifier)
					.then(() => this.toggleIcon(elem, '✅'))
					.catch(() => this.toggleIcon(elem, '❌'))
			}
		},
		toggleIcon(elem, newIcon) {
			if (elem) {
				let oldIcon = elem.innerText;
				elem.innerText = newIcon;
				setTimeout(() => elem.innerText = oldIcon, 2000);
			}
		},
		generateSummaries() {
			let hasLoader = typeof this.loadAdditionalData === 'function';
			let summaries = [];
			for(let index in this.data) {
				let entry = this.data[index];
				let summary = {
					identifier: index,
					summary: '',
					show: true,
					loaded: !hasLoader,
					index: index,
					experimental: entry.experimental,
					deprecated: entry.deprecated,
					data: null // Fill later, see below
				};

				if (typeof this.identifierKey === 'string' && typeof entry[this.identifierKey] === 'string') {
					summary.identifier = entry[this.identifierKey];
				}
				if (typeof this.summaryKey === 'string' && typeof entry[this.summaryKey] === 'string') {
					summary.summary = entry[this.summaryKey];
				}
				if (typeof this.keywordsKey === 'string' && Array.isArray(entry[this.keywordsKey])) {
					summary.keywords = entry[this.keywordsKey];
				}
				else {
					summary.keywords = [];
				}

				// Set the data property only after the call to Vue.observable for a performance increase.
				// Making the whole object in data observable is pretty slow as they can get pretty massive in size.
				let observable = Vue.observable(summary);
				observable.data = entry;
				summaries.push(observable);
			}
			if (this.sort) {
				summaries.sort((a,b) => Utils.compareStringCaseInsensitive(a.identifier, b.identifier));
			}
			this.summaries = summaries;
		},
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
		async toggleDetails(i, newState) {
			if (!this.offerDetails) {
				return;
			}
			if (typeof newState === 'undefined') {
				newState = !this.showDetails[i];
			}
			if (typeof this.showDetails[i] === 'undefined' && newState === false) {
				return;
			}
			this.$set(this.showDetails, i, newState);
			let summary = this.summaries[i];
			if (newState && typeof this.loadAdditionalData === 'function' && !summary.loaded) {
				try {
					summary.data = await this.loadAdditionalData(summary.index, summary.identifier, summary.data);
					summary.loaded = true;
				} catch (error) {
					console.error(error);
				}
			}
			this.$emit('detailsToggled', newState, summary.index, summary.identifier, summary.data);
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.searchable-list {

	&.expandable .heading {
		cursor: pointer;
		padding-left: 1em;

		&:before {
			content: "▸";
			margin-left: -1em;
			float: left;
			font-size: 1em;
		}
	}
	&.expandable.expanded .heading:before {
		content: "▾";
	}

	.action-bar {
		width: 100%;
		display: flex;
		margin-bottom: 1em;
		padding: 1px;
		gap: 0.5em;

		> .search-box {
			min-width: 150px;
			flex: 1;
			margin: 0;
		}

		> .deprecated {
			white-space: nowrap;
			align-content: center;
		}
	}

	.details  {
		display: none;
	}
	.list .details {
		h2, h3, h4, h5, h6 {
			font-size: 1em;
		}
	}
	ul.list {
		margin-left: 0;
		padding-left: 0;
		list-style-type: none;

		> li {
			margin-bottom: 0.5em;

			> summary {
				margin-bottom: 0.5em;
				margin-left: 1em;
				line-height: 1.33em;

				strong {
					display: block;
					text-overflow: ellipsis;
					overflow: hidden;

					.copy {
						display: none;
					}

					&.inline {
						display: inline;
					}
				}
				&.experimental strong {
					color: blueviolet;
				}
				&.deprecated strong {
					text-decoration: line-through;
				}
				&:before {
					content: "▸";
					margin-left: -1em;
					float: left;
					font-size: 1em;
				}
				.badges.block {
					display: block;
				}
			}
		}
	}
	ul.expandable {
		> li {
			> summary {
				cursor: pointer;
				
				&:hover {
					strong .copy {
						display: inline-block !important;
					}
				}
			}
			&.expanded {
				margin-bottom: 2em;

				.details {
					display: block;
					margin-left: 1em;
				}
				> summary {
					&:before {
						content: "▾";
					}
					.hideOnExpand {
						display: none;
					}
				}
			}
		}
	}
}
</style>