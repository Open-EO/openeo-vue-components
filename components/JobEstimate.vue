<template>
	<div class="vue-component estimate">
		<h2>Estimate</h2>

		<div class="tabular">
			<label>Costs:</label>
			<span class="value">{{ costs }}</span>
		</div>
		<div class="tabular">
			<label>Runtime:</label>
			<span class="value">{{ duration }}</span>
		</div>
		<div class="tabular">
			<label>File size:</label>
			<span class="value">{{ size }}</span>
		</div>
		<div class="tabular">
			<label>Downloads included:</label>
			<span class="value">{{ downloadsIncluded }}</span>
		</div>
		<div class="tabular" v-if="expires">
			<label>Valid until:</label>
			<span class="value">{{ expires }}</span>
		</div>
	</div>
</template>

<script>
import Utils from '../utils';
import { isoDuration, en } from '@musement/iso-duration';

export default {
	name: 'JobEstimate',
	props: {
		estimate: {
			type: Object,
			default: () => ({})
		},
		currency: {
			type: String,
			default: null
		}
	},
	computed: {
		downloadsIncluded() {
			if (this.estimate.downloads_included === 0) {
				return "None";
			}
			else if (this.estimate.downloads_included > 0) {
				return `Yes, ${this.estimate.downloads_included}×`;
			}
			else {
				return "Yes, unlimited";
			}
		},
		expires() {
			return Utils.formatTimestamp(this.estimate.expires, null);
		},
		costs() {
			return Utils.formatCurrency(this.estimate.costs, this.currency, 'n/a');
		},
		size() {
			return Utils.formatFileSize(this.estimate.size, 'n/a');
		},
		duration() {
			if (typeof this.estimate.duration === 'string') {
				isoDuration.setLocales({en});
				const duration = isoDuration(this.estimate.duration);
				return duration.humanize('en');
			}
			else {
				return 'n/a';
			}
		}
	}
}
</script>