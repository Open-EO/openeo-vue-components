<template>
	<div v-show="enabled && active" class="tabContent">
		<slot :tab="this"></slot>
	</div>
</template>


<script>
export default {
	name: 'Tab',
	props: {
		id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			default: null
		},
		selected: {
			type: Boolean,
			default: false
		},
		enabled: {
			type: Boolean,
			default: true
		},
		data: {},
		closable: {
			type: Boolean,
			default: false
		},
		allowShow: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			active: false
		};
	},
	mounted() {
		this.active = this.selected;
		this.$on('hide', () => this.active = false);
		this.$on('show', () => this.active = true);
	},
	watch: {
		enabled(newVal) {
			if (!newVal && this.active && this.$parent && this.$parent.$options.name === 'Tabs') {
				this.$parent.resetActiveTab(true);
			}
		}
	},
	methods: {
		async canShow() {
			if (this.active) {
				return true;
			}
			else if (typeof this.allowShow !== 'function' || await this.allowShow(this)) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}
</script>