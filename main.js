import Vue from 'vue';
import vueCustomElement from 'vue-custom-element';

// Import common elements to not have them in all custom elements
import Utils from './utils.js';
import './components/base.css';

Vue.use(vueCustomElement);

// Make all components available as custom async elements
Vue.customElement("openeo-billing-plans", () => import(/* webpackChunkName: "billing-plans" */'./components/BillingPlans.vue'));
Vue.customElement("openeo-capabilities", () => import(/* webpackChunkName: "capabilities" */'./components/Capabilities.vue'));
Vue.customElement("openeo-collection", () => import(/* webpackChunkName: "collection" */'./components/Collection.vue'), { props: ['collection'] });
Vue.customElement("openeo-collections", () => import(/* webpackChunkName: "collections" */'./components/Collections.vue'));
Vue.customElement("openeo-deprecation-notice", () => import(/* webpackChunkName: "deprecation-notice" */'./components/DeprecationNotice.vue'));
Vue.customElement("openeo-description", () => import(/* webpackChunkName: "description" */'./components/Description.vue'));
Vue.customElement("openeo-experimental-notice", () => import(/* webpackChunkName: "experimental-notice" */'./components/ExperimentalNotice.vue'));
Vue.customElement("openeo-file-format", () => import(/* webpackChunkName: "file-format" */'./components/FileFormat.vue'));
Vue.customElement("openeo-file-formats", () => import(/* webpackChunkName: "file-formats" */'./components/FileFormats.vue'));
Vue.customElement("openeo-json-schema", () => import(/* webpackChunkName: "json-schema" */'./components/JsonSchema.vue'));
Vue.customElement("openeo-link-list", () => import(/* webpackChunkName: "link-list" */'./components/LinkList.vue'));
Vue.customElement("openeo-object-tree", () => import(/* webpackChunkName: "object-tree" */'./components/ObjectTree.vue'));
Vue.customElement("openeo-process", () => import(/* webpackChunkName: "process" */'./components/Process.vue'));
Vue.customElement("openeo-processes", () => import(/* webpackChunkName: "processes" */'./components/Processes.vue'));
Vue.customElement("openeo-searchable-list", () => import(/* webpackChunkName: "searchable-list" */'./components/SearchableList.vue'));
Vue.customElement("openeo-search-box", () => import(/* webpackChunkName: "search-box" */'./components/SearchBox.vue'));
Vue.customElement("openeo-service-type", () => import(/* webpackChunkName: "service-type" */'./components/ServiceType.vue'));
Vue.customElement("openeo-service-types", () => import(/* webpackChunkName: "service-types" */'./components/ServiceTypes.vue'));
Vue.customElement("openeo-supported-features", () => import(/* webpackChunkName: "supported-features" */'./components/SupportedFeatures.vue'));
Vue.customElement("openeo-tab", () => import(/* webpackChunkName: "tabs" */'./components/Tab.vue'));
Vue.customElement("openeo-tabs", () => import(/* webpackChunkName: "tabs" */'./components/Tabs.vue'));
Vue.customElement("openeo-udf-runtime", () => import(/* webpackChunkName: "udf-runtime" */'./components/UdfRuntime.vue'));
Vue.customElement("openeo-udf-runtimes", () => import(/* webpackChunkName: "udf-runtimes" */'./components/UdfRuntimes.vue'));