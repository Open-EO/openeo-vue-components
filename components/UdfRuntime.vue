<template>
	<article class="vue-component udf-runtime">

		<slot name="title">
			<a class="anchor" :name="id"></a>
			<h2>{{ title }}</h2>
		</slot>

		<ul class="badges">
			<li v-if="isDocker" class="badge docker">Docker: {{ data.docker }}</li>
			<li v-else class="badge">Programming Language</li>
		</ul>

		<section class="description" v-if="data.description">
			<Description :description="data.description"></Description>
		</section>

		<section class="links">
			<LinkList :links="data.links" heading="See Also" headingTag="h3" />
		</section>

		<template v-if="isDocker">
			<h3>Tags</h3>
			<ul>
				<li v-for="tag in tags" :key="tag">
					{{ tag }}
					<ul v-if="tag === data.default" class="badges small"><li class="badge default">default</li></ul>
				</li>
			</ul>
		</template>
		<template v-else>
			<h3>Versions</h3>
			<Tabs id="userContent" ref="tabs">
				<Tab v-for="(env, version) in data.versions" :key="version" :id="version" :name="version" :selected="version === selectVersion">
					<ul v-if="version === data.default" class="badges">
						<li class="badge default">default</li>
					</ul>
					<p>This runtime includes support for:</p>
					<ul>
						<li class="library" v-for="(library, name) in env.libraries" :key="name">
							{{ name }}
							<ul class="badges small">
								<span class="badge">{{ library.version }}</span>
								<span v-if="library.deprecated" class="badge deprecated">deprecated</span>
							</ul>
							<LinkList :links="library.links" />
						</li>
					</ul>
				</Tab>
			</Tabs>
		</template>

	</article>
</template>

<script>
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';
import Utils from '../utils.js';

export default Utils.enableHtmlProps({
	name: 'UdfRuntime',
	components: {
		Description,
		LinkList,
		Tabs,
		Tab
	},
	props: {
		id: {
			type: String,
			default: ''
		},
		data:  {
			type: Object,
			default: () => ({})
		},
		version: {
			type: String,
			default: null
		}
	},
	computed: {
		title() {
			return this.data.title || this.id;
		},
		isDocker() {
			return Boolean(this.data.type === 'docker' || (this.data.docker && this.data.tags));
		},
		selectVersion() {
			if ((Utils.isObject(this.data.versions) && this.data.versions[this.version]) || (Array.isArray(this.data.tags) && this.data.tags[this.version])) {
				return this.version;
			}
			else {
				return this.data.default;
			}
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

<style scoped>
h4 {
	margin: 0.25em 0 0.75em 0;
}
.vue-component .badges .badge {
	margin-left: 0;
}
.vue-component .tabContent {
	padding: 0.5em;
}
.badge.deprecated {
	background-color: red;
}
.library {
	margin-bottom: 0.5em;
}
</style>