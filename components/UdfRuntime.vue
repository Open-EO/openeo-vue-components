<template>
	<article class="vue-component udf-runtime">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="id"></a>
			<h2>
				<template v-if="runtime.title">
					{{ runtime.title }}
					(<code class="id">{{ id }}</code>)
				</template>
				<code class="id" v-else>{{ id }}</code>
			</h2>
		</slot>

		<slot name="badges" v-bind="$props">
			<ul class="badges">
				<li v-if="isDocker" class="badge docker">Docker: {{ runtime.docker }}</li>
				<li v-else class="badge">Programming Language</li>
			</ul>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<section class="description" v-if="runtime.description || runtime.deprecated || runtime.experimental || runtime['federation:backends']">
			<Description v-if="runtime.description" :description="runtime.description"></Description>
			<DeprecationNotice v-if="runtime.deprecated" entity="UDF runtime" />
			<ExperimentalNotice v-if="runtime.experimental" entity="UDF runtime" />
			<FederationNotice v-if="runtime['federation:backends']" :backends="runtime['federation:backends']" :federation="federation" entity="UDF runtime" />
		</section>

		<section class="links">
			<LinkList :links="runtime.links" heading="See Also" headingTag="h3" />
		</section>

		<template v-if="isDocker">
			<h3>Tags</h3>
			<ul>
				<li v-for="tag in runtime.tags" :key="tag">
					{{ tag }}
					<ul v-if="tag === runtime.default" class="badges small"><li class="badge default">default</li></ul>
				</li>
			</ul>
		</template>
		<template v-else>
			<h3>Versions</h3>
			<Tabs id="userContent" ref="tabs">
				<Tab v-for="(env, version) in runtime.versions" :key="version" :id="`${id}-${version}`" :name="version" :selected="version === selectVersion">
					<ul v-if="version === runtime.default" class="badges">
						<li class="badge default">default</li>
					</ul>
					<DeprecationNotice v-if="env.deprecated" entity="UDF runtime version" />
					<ExperimentalNotice v-if="env.experimental" entity="UDF runtime version" />
					<FederationNotice v-if="env['federation:backends']" :backends="env['federation:backends']" :federation="federation" entity="UDF runtime version" />
					<p>This runtime includes support for:</p>
					<ul>
						<li class="library" v-for="(library, name) in env.libraries" :key="name">
							{{ name }}
							<ul class="badges small">
								<span class="badge">{{ library.version }}</span>
								<span v-if="library.experimental" class="badge experimental">experimental</span>
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
import Utils from '../utils.js';
import FederationMixin from './internal/FederationMixin.js';

export default {
	name: 'UdfRuntime',
	components: {
		DeprecationNotice: () => import('./DeprecationNotice.vue'),
		Description: () => import('./Description.vue'),
		ExperimentalNotice: () => import('./ExperimentalNotice.vue'),
		LinkList: () => import('./LinkList.vue'),
		Tabs: () => import('./Tabs.vue'),
		Tab: () => import('./Tab.vue')
	},
	mixins: [
		FederationMixin
	],
	props: {
		id: {
			type: String,
			default: ''
		},
		runtime:  {
			type: Object,
			default: () => ({})
		},
		version: {
			type: String,
			default: null
		},
		...FederationMixin.props
	},
	computed: {
		title() {
			return this.runtime.title || this.id;
		},
		isDocker() {
			return Boolean(this.runtime.type === 'docker' || (this.runtime.docker && this.runtime.tags));
		},
		selectVersion() {
			if ((Utils.isObject(this.runtime.versions) && this.runtime.versions[this.version]) || (Array.isArray(this.runtime.tags) && this.runtime.tags[this.version])) {
				return this.version;
			}
			else {
				return this.runtime.default;
			}
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use './base.scss';

.vue-component.udf-runtime {
	h4 {
		margin: 0.25em 0 0.75em 0;
	}
	.tabContent {
		padding: 0.5em;
	}
	.library {
		margin-bottom: 0.5em;
	}
}
</style>