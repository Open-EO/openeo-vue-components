<template>
	<div :class="{tabs: true, hide: !hasEnabledTabs, hideNames: hideNames, pills: pills, boxed: !pills}" :id="id">
		<div class="tabsHeader" ref="tabsHeader">
			<button type="button" v-show="tab.enabled" :class="{tabItem: true, tabActive: tab.active, tabHasIcon: !!tab.icon }" @click="selectTab(tab)" :title="tab.name" v-for="tab in tabs" :key="tab.id">
				<i v-if="tab.icon" :class="['fas', tab.icon]"></i>
				<span class="tabName">{{ tab.name }}</span>
				<span class="tabClose" @click.prevent.stop="closeTab(tab)" v-if="tab.closable"><i class="far fa-times-circle"></i></span>
			</button>
		</div>
		<div class="tabsBody">
			<slot :tabs="this"></slot>
			<Tab v-for="tab in this.dynamicTabs" :id="tab.id" :name="tab.name" :icon="tab.icon" :selected="tab.selected" :enabled="tab.enabled" :closable="true" @close="onDynamic(tab, 'close')" @hide="onDynamic(tab, 'hide')" @show="onDynamic(tab, 'show')" :allowShow="() => onDynamicAllowShow(tab)" :key="tab.id">
				<slot :name="tab.id" :tab="tab"><slot name="dynamic" :tab="tab"></slot></slot>
			</Tab>
		</div>
	</div>
</template>

<script>
import EventBus from '../eventbus.js';
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
		}
	},
	data() {
		return {
			tabIdCounter: 0,
			tabs: [],
			dynamicTabs: [],
			hideNames: false
		};
	},
	mounted() {
		if (Array.isArray(this.$children)) {
			this.tabs = this.$children;
			this.resetActiveTab();
		}

		EventBus.$on('windowResized', this.onResize);
		this.$nextTick(this.onResize);
	},
	computed: {
		hasEnabledTabs() {
			return this.tabs.filter(t => t.enabled).length > 0;
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
				this.$nextTick(() => this.selectTab(id));
			}
		},
		onDynamic(tab, evt) {
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (typeof tab[evt] === 'function' && index === -1) {
				tab[evt](this.tabs[index]);
			}
		},
		async onDynamicAllowShow(tab) {
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (typeof tab.allowShow === 'function' && index === -1) {
				return await tab.allowShow(this.tabs[index]);
			}
			return true;
		},
		onResize() {
			var tabsHeaderWidth = this.$refs.tabsHeader.getBoundingClientRect().width;
			this.hideNames = tabsHeaderWidth < this.tabs.length * 75;
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
			for (let i in this.tabs) {
				if (this.tabs[i].active) {
					return this.tabs[i];
				}
			}
			return null;
		},
		getActiveTabId() {
			var tab = this.getActiveTab();
			if (tab !== null) {
				return tab.id;
			}
			return null;
		},
		async selectTab(selectedTab) {
			var activeTab = this.getActiveTab();
			if (typeof selectedTab === "string") {
				selectedTab = this.getTab(selectedTab); // Get tab by id
			}
			if (activeTab === selectedTab) {
				return;
			}
			if (!selectedTab || typeof selectedTab.show !== 'function') {
				console.warn("Invalid tab", selectedTab);
				return;
			}
			if (await selectedTab.show() && activeTab !== null) {
				activeTab.hide();
			}
		},
		closeTab(tab) {
			if (typeof tab === "string") {
				tab = this.getTab(tab); // Get tab by id
			}
			var index = this.tabs.findIndex(t => t.id === tab.id);
			if (index !== -1) {
				this.tabs.splice(index, 1);
				var index2 = this.dynamicTabs.findIndex(t => t.id === tab.id);
				if (index2 !== -1) {
					this.dynamicTabs.splice(index2, 1);
				}
				tab.close();
				this.resetActiveTab();
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
.tabs.boxed {
	border-radius: 3px;
	border: 1px solid #aaa;
}
.tabs .tabsHeader {
	display: flex;
}
.tabs.boxed .tabsHeader {
	background-color: #f9f9f9;
}
.tabs .tabsBody {
	flex-grow: 1;
	overflow: auto;
	height: 100%;
}
.tabs.hide {
	display: none;
}
.tabs .tabHasIcon .tabName {
	margin-left: 0.25em;
}
.tabs.hideNames .tabHasIcon .tabName {
	display: none;
}
.tabs.boxed .tabContent {
	background-color: white;
	border-top: 1px solid #ddd;
	padding-top: 1px;
	height: calc(100% - 2px);
}
.tabs.pills .tabContent {
	height: 100%;
}
.tabs .tabContent.tabActive {
	display: block;
}

.tabs .tabItem {
	background-color: transparent;
	border: 0;
	padding: 5px 10px;
	margin: 5px 5px 0px 0px;
	white-space: nowrap;
	min-width: 5em;
	text-overflow: ellipsis;
	overflow: hidden;
	cursor: pointer;
}
.tabs .tabItem::-moz-focus-inner {
	border: 0;
}
.tabs.boxed .tabItem {
	border: 1px solid #aaa;
	border-bottom: 0;
	border-radius: 5px 5px 0 0;
	color: #666;
	background-color: #eee;
}
.tabs.boxed .tabItem:first-of-type {
	margin-left: 5px;
}
.tabs.pills .tabItem {
	border: 1px solid #000;
	border-radius: 5px;
	color: #000;
	opacity: 0.6;
}
.tabs .tabItem:focus {
	outline: none;
}
.tabs.hideNames .tabItem {
	min-width: 3em;
}
.tabs.boxed .tabItem:hover .fas, .tabs.boxed .tabItem:hover .tabName {
	color: black;
}
.tabs.pills .tabItem:hover {
	opacity: 1;
}
.tabs.boxed .tabItem.tabActive {
	background-color: white;
	color: black;
	padding-bottom: 6px;
	margin-bottom: -1px;
	z-index: 1;
}
.tabs.pills .tabItem.tabActive {
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