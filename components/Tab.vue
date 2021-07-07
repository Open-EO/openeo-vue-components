<template>
	<div v-show="enabled && active" class="tabContent">
		<slot :tab="this"></slot>
	</div>
</template>

<script>
import Utils from '../utils';

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
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	mounted() {
		this.updateState();
		this.$on('hide', () => this.active = false);
		this.$on('show', () => this.active = true);
		if (this.icon) {
			Utils.loadFontAwesome(this);
		}
	},
	watch: {
		selected() {
			this.updateState();
		},
		enabled() {
			this.updateState();
		}
	},
	methods: {
		updateState() {
			this.active = this.selected;
			if (this.enabled && this.active) {
				this.getTabs().selectTab(this);
			}
			else {
				this.getTabs().resetActiveTab(true);
			}
		},
		getTabs() {
			let parent = this.$parent;
			while(parent && parent.$options.name !== 'Tabs') {
				parent = parent.$parent;
			}
			return parent;
		},
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