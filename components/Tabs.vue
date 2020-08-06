<template>
	<div :class="classes" :id="id">
		<div class="tabsHeader" ref="tabsHeader">
			<button type="button" v-show="tab.enabled" :class="{tabItem: true, tabActive: tab.active, tabHasIcon: !!tab.icon }" @click.left="selectTab(tab)" @click.middle="closeTab(tab)" :title="tab.name" v-for="tab in tabs" :key="tab.id">
				<i v-if="tab.icon" :class="['tabIcon', 'fas', tab.icon]"></i>
				<span class="tabName"><slot name="tabName" :tab="tab">{{ tab.name }}</slot></span>
				<span class="tabClose" v-if="tab.closable" title="Close" @click.prevent.stop="closeTab(tab)"><i class="far fa-times-circle"></i></span>
			</button>
		</div>
		<div class="tabsBody">
			<slot :tabs="this"></slot>
			<Tab v-for="tab in this.dynamicTabs" :id="tab.id" :name="tab.name" :icon="tab.icon" :selected="tab.selected" :data="tab.data" :enabled="tab.enabled" :closable="tab.closable" @close="onDynamic(tab, 'close')" @hide="onDynamic(tab, 'hide')" @show="onDynamic(tab, 'show')" :allowShow="() => onDynamicAllowShow(tab)" :key="tab.id">
				<slot :name="tab.id" :tab="tab"><slot name="dynamic" :tab="tab"></slot></slot>
			</Tab>
		</div>
	</div>
</template>

<script>
import Tab from './Tab.vue'

export default {
	name: "Tabs",
	components: {
		Tab
	},
	props: {
		id: {
			type: String,
			required: true
		},
		pills: {
			type: Boolean,
			default: false
		},
		position: {
			type: String,
			default: 'top'
		}
	},
	data() {
		return {
			tabIdCounter: 0,
			tabs: [],
			activeTab: null,
			dynamicTabs: [],
			spaceLimited: false
		};
	},
	mounted() {
		if (Array.isArray(this.$children)) {
			this.tabs = this.$children;
			this.resetActiveTab();
		}

		this.$root.$on('windowResized', this.adjustSizes);
		this.$nextTick(this.adjustSizes);
	},
	computed: {
		hasEnabledTabs() {
			return this.tabs.filter(t => t.enabled).length > 0;
		},
		classes() {
			var classes = [
				'tabs',
				this.pills ? 'pills' : 'boxed',
				this.position
			];
			if (!this.hasEnabledTabs) {
				classes.push('hide');
			}
			if (this.spaceLimited) {
				classes.push('spaceLimited');
			}
			return classes;
		}
	},
	watch: {
		activeTab() {
			this.adjustSizes();
		}
	},
	methods: {
		addTab(name, icon = null, data = null, id = null, selected = false, closable = false, show = null, hide = null, close = null, allowShow = null) {
			if (!id) {
				id = this.id + "_tab_" + this.tabIdCounter++;
			}
			this.dynamicTabs.push({
				id: id,
				name: name,
				icon: icon,
				data: data,
				selected: selected,
				enabled: true,
				closable: closable,
				show: show,
				hide: hide,
				close: close,
				allowShow: allowShow
			});
			if (selected) {
				this.$nextTick(() => {
					this.selectTab(id);
					this.adjustSizes();
				});
			}
		},
		onDynamic(tab, evt) {
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (typeof tab[evt] === 'function' && index !== -1) {
				tab[evt](this.tabs[index]);
			}
		},
		async onDynamicAllowShow(tab) {
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (typeof tab.allowShow === 'function' && index !== -1) {
				return await tab.allowShow(this.tabs[index]);
			}
			return true;
		},
		adjustSizes() {
			if (!this.$refs.tabsHeader) {
				return;
			}

			this.spaceLimited = this.$refs.tabsHeader.getBoundingClientRect().width < this.tabs.length * 96; // 96 = 6em = 6*16
			this.$nextTick(() => {
				if (!this.$refs.tabsHeader) {
					return;
				}
				var overflows = this.$refs.tabsHeader.scrollWidth > this.$refs.tabsHeader.parentNode.getBoundingClientRect().width;
				this.$refs.tabsHeader.style.overflowX = overflows ? "auto" : "visible";
				this.$refs.tabsHeader.style.overflowY = overflows ? "hidden" : "visible";
			});
		},
		getTab(id) {
			for (let i in this.tabs) {
				if (this.tabs[i].id == id) {
					return this.tabs[i];
				}
			}
			return null;
		},
		getActiveTab() {
			return this.activeTab;
		},
		getActiveTabId() {
			if (this.activeTab !== null) {
				return this.activeTab.id;
			}
			else {
				return null;
			}
		},
		async selectTab(selectedTab) {
			if (typeof selectedTab === "string") {
				selectedTab = this.getTab(selectedTab); // Get tab by id
			}
			if (this.activeTab === selectedTab || !selectedTab) {
				return;
			}
			if (await selectedTab.canShow()) {
				if (this.activeTab !== null) {
					this.activeTab.active = false;
					this.activeTab.$emit('hide', this.activeTab);
				}
				this.activeTab = selectedTab;
				this.activeTab.active = true;
				// Make sure the component is really shown by using nextTick...
				this.$nextTick(() => this.activeTab.$emit('show', this.activeTab));
			}
		},
		closeTab(tab) {
			if (typeof tab === "string") {
				tab = this.getTab(tab); // Get tab by id
			}
			if (!tab.closable) {
				return;
			}
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (index !== -1) {
				this.tabs.splice(index, 1);
				var index2 = this.dynamicTabs.findIndex(t => t.id === tab.id);
				if (index2 !== -1) {
					this.dynamicTabs.splice(index2, 1);
				}
				if (tab === this.activeTab) {
					this.activeTab = null;
				}
				tab.$emit('close', tab);
				this.resetActiveTab();
				this.adjustSizes();
			}
		},
		resetActiveTab(force = false) {
			if (this.tabs.length === 0) {
				return;
			}
			if (force || this.getActiveTab() === null) {
				this.selectTab(this.tabs[0]);
			}
		}
	}
};
</script>

<style>
.tabs {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.tabs.bottom {
	flex-direction: column-reverse;
}
.tabs.boxed {
	border-radius: 3px;
	border: 1px solid #aaa;
}
.tabs .tabsHeader {
	display: flex;
}
.tabs.boxed > .tabsHeader {
	padding-left: 5px;
}
.tabs.boxed > .tabsHeader {
	background-color: #f9f9f9;
}
.tabs .tabsBody {
	flex-grow: 1;
	height: 100%;
	overflow: hidden;
}
.tabs.hide {
	display: none;
}
.tabs .tabName, .tabs .tabIcon, .tabs .tabClose {
	display: inline-block;
	vertical-align: middle;
}
.tabs .tabName {
	text-overflow: ellipsis;
	overflow: hidden;
	min-width: 2em;
	flex-grow: 1;
}
.tabs .tabHasIcon .tabName {
	margin-left: 5px;
}
.tabs.spaceLimited .tabHasIcon:not(.tabActive) .tabName {
	display: none;
}
.tabs.spaceLimited .tabItem:not(.tabActive) .tabClose {
	display: none;
}
.tabs.boxed > .tabsBody > .tabContent {
	background-color: white;
	overflow: auto;
	height: 100%;
}
.tabs.boxed.top > .tabsBody > .tabContent {
	border-top: 1px solid #ddd;
	height: calc(100% - 2px);
}
.tabs.boxed.bottom > .tabsBody > .tabContent {
	border-bottom: 1px solid #ddd;
	padding-bottom: 1px;
	height: calc(100% - 2px);
}
.tabs.pills > .tabsBody > .tabContent {
	height: 100%;
}
.tabs .tabContent.tabActive {
	display: block;
}

.tabs .tabItem {
	display: flex;
	background-color: transparent;
	border: 0;
	padding: 5px 10px;
	min-width: 6em;
	white-space: nowrap;
	cursor: pointer;
}
.tabs.top .tabItem {
	margin: 5px 5px 0 0;
}
.tabs.bottom .tabItem {
	margin: 0 5px 5px 0;
}
.tabs .tabItem::-moz-focus-inner {
	border: 0;
}
.tabs.boxed > .tabsHeader > .tabItem {
	border: 1px solid #aaa;
	color: #666;
	background-color: #eee;
}
.tabs.boxed.top > .tabsHeader > .tabItem {
	border-bottom: 0;
	border-radius: 5px 5px 0 0;
}
.tabs.boxed.bottom > .tabsHeader > .tabItem {
	border-top: 0;
	border-radius: 0 0 5px 5px;
}
.tabs.pills > .tabsHeader > .tabItem {
	border: 1px solid #000;
	border-radius: 5px;
	color: #000;
	opacity: 0.6;
}
.tabs .tabItem:focus {
	outline: none;
}
.tabs.spaceLimited .tabItem {
	min-width: auto;
}
.tabs.boxed > .tabsHeader > .tabItem:hover .fas, .tabs.boxed > .tabsHeader > .tabItem:hover .tabName {
	color: black;
}
.tabs.pills > .tabsHeader > .tabItem:hover {
	opacity: 1;
}
.tabs.boxed > .tabsHeader > .tabItem.tabActive {
	background-color: white;
	color: black;
	z-index: 1;
}
.tabs.boxed.top > .tabsHeader > .tabItem.tabActive {
	padding-bottom: 6px;
	margin-bottom: -1px;
}
.tabs.boxed.bottom > .tabsHeader > .tabItem.tabActive {
	padding-top: 6px;
	margin-top: -1px;
}
.tabs.pills > .tabsHeader > .tabItem.tabActive {
	opacity: 1;
	border-width: 2px;
	padding: 4px 9px;
}
.tabs .tabItem .tabClose {
	display: inline-block;
	margin-left: 5px;
}
.tabs .tabItem .tabClose:hover {
	color: red;
}
</style>