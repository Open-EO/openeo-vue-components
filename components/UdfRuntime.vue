<template>
	<article class="vue-component udf-runtime">

		<a class="anchor" :name="runtimeId"></a>
		<h2>{{ title }}</h2>

		<ul class="badges">
			<li v-if="isDocker" class="badge docker">Docker: {{ runtimeData.docker }}</li>
			<li v-else class="badge">Programming Language</li>
		</ul>

		<section class="description" v-if="runtimeData.description">
			<Description :description="runtimeData.description"></Description>
		</section>

		<section class="links">
			<LinkList :links="runtimeData.links" heading="See Also" headingTag="h3" />
		</section>

		<template v-if="isDocker">
			<h3>Tags</h3>
			<ul>
				<li v-for="tag in tags" :key="tag">
					{{ tag }}
					<ul v-if="tag === runtimeData.default" class="badges small"><li class="badge default">default</li></ul>
				</li>
			</ul>
		</template>
		<template v-else>
			<h3>Versions</h3>
			<Tabs id="userContent" ref="tabs">
				<Tab v-for="(env, version) in runtimeData.versions" :key="version" :id="version" :name="version" :selected="version === selectVersion">
					<ul v-if="version === runtimeData.default" class="badges">
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
import { MigrateProcesses } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'UdfRuntime',
	components: {
		Description,
		LinkList,
		Tabs,
		Tab
	},
	props: {
		runtimeId: String,
		runtimeData: Object,
		runtimeVersion: {
			type: String,
			default: null
		}
	},
	computed: {
		title() {
			return this.runtimeData.title || this.runtimeId;
		},
		isDocker() {
			return Boolean(this.runtimeData.type === 'docker' || (this.runtimeData.docker && this.runtimeData.tags));
		},
		selectVersion() {
			if ((Utils.isObject(this.runtimeData.versions) && this.runtimeData.versions[this.runtimeVersion]) || (Array.isArray(this.runtimeData.tags) && this.runtimeData.tags[this.runtimeVersion])) {
				return this.runtimeVersion;
			}
			else {
				return this.runtimeData.default;
			}
		}
	}
}
</script>

<style scoped>
h4 {
	margin: 0.25em 0 0.75em 0;
}
.vue-component .badges .badge {
	margin-left: 0;
}
.badge.deprecated {
	background-color: red;
}
.library {
	margin-bottom: 0.5em;
}
</style>