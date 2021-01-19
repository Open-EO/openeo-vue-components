# Vue Components for openEO

A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

This library's version is **2.0.0-beta.1** and supports **openEO API versions 1.0.x**.
Legacy versions supporting API version 0.x are available as [releases](https://github.com/Open-EO/openeo-vue-components/releases).

npm: [@openeo/vue-components](https://www.npmjs.com/package/@openeo/vue-components)

**Table of Contents:**

1. [Usage](#usage)
	* [HTML](#html)
	* [Vue](#vue)
2. [Components](#components)
	* [BillingPlans](#billingplans)
	* [Capabilities](#capabilities)
	* [Collection](#collection)
	* [Collections](#collections)
	* [DeprecationNotice](#deprecationnotice)
	* [Description](#description)
	* [ExperimentalNotice](#experimentalnotice)
	* [FileFormat](#fileformat)
	* [FileFormats](#fileformats)
	* [JsonSchema](#jsonschema)
	* [LinkList](#linklist)
	* [ObjectTree](#objecttree)
	* [Process](#process)
	* [Processes](#processes)
	* [SearchableList](#searchablelist)
	* [ServiceType](#servicetype)
	* [ServiceTypes](#servicetypes)
	* [SupportedFeatures](#supportedfeatures)
	* [Tabs and Tab](#tabs-and-tab)
	* [UdfRuntime](#udfruntime)
	* [UdfRuntimes](#udfruntimes)
3. [Other Features](#other-features)
	* [FeatureList](#featurelist)
	* [Utils](#utils)

## Usage

All components listed below can be used in two different environments: 
Directly as HTML tag in an HTML page or in a Vue environment as normal Single File Components (SFC).

### HTML

To use the components in HTML (as so-called 'Web Components'), simply include the following into the `head` of your HTML page:

```html
<script src="https://cdn.jsdelivr.net/npm/@openeo/vue-components@latest/assets/openeo.min.js"></script>
```

All components can be used as HTML tags in kebab-case.
For example, the component `BillingPlans` can be used as `<billing-plans></billing-plans>`.
Props can be passed as HTML attributes if the value is a scalar.
For arrays and objects, you have to specify them as child `script` tags with the attributes `prop="..."` and `type="application/json"`.

For example, the `Capabilities` component can be used as follows:
```html
<capabilities url="https://example.com/api">
	<script prop="capabilities" type="application/json">
		{
			"api_version": "1.0.0",
			...
		}
	</script>
</capabilities>
```

The components are async web components, which means only the components you are actually using are requested. This keeps page loading times at a minimum.

*Note for Contributors:* Web Components must be built via `npm run build` and will be placed in the `assets` folder. Examples can be generated using `npm run wc-examples` and will be placed in the `examples` folder. You can also serve the examples via HTTP with the command `npm run wc-serve`.

### Vue

In a Vue environment, you can just import the Single File Components directly.

First, you need to install the package: `npm install @openeo/vue-components --save`
Now, you can import the Vue components with the `import` or `require`, depending on the module system you are using.

For example, the `Capabilities` component can be imported as follows:
* `const Capabilities = require('@openeo/vue-components/components/Capabilities.vue');` (Node.js require)
* `import Capabilities from '@openeo/vue-components/components/Capabilities.vue';` (ES6 modules)

Afterwards, you need to declare the component in the `components` section of your SFC, e.g. `components: { Capabilities }`.

In the Template of your SFC you can now include the component as shown in the example below. Please note that `url` and `capabilities` must be defined in the SFC, e.g. in `data` property or as `computed` property.

```html
<Capabilities :url="url" :capabilities="capabilities"></Capabilities>
```

*Note for Contributors*: This usage mode doesn't require the initial build step `npm run build`. The Vue Components can simply be imported from the `components` folder. You can also serve examples via HTTP with the command `npm run serve`.

## Components

*Note: Methods, properties and slots not listed here are not meant to be used as public and stable API.*

### `BillingPlans`

Visualizes the billing information of the back-end.

**Properties:**
- `billing` (object, required): Billing information as defined by the openEO API (`GET /`, property `billing`).


### `Capabilities`

Visualizes fundamental server information of the back-end. Shows the URL, title, description, version numbers, links, the production flag, `SupportedFeatures` and `BillingPlans`.

**Properties:**
- `capabilities` (object, required): Capabilities response as defined by the openEO API (`GET /`).
- `url` (string): URL to the API. If not set, the URL from the link with relation type `self` is shown. If neither is available, no URL is shown.


### `Collection`

Visualizes a single collection following the STAC-based collection description.

**Properties:**

- `collection` (object, required): A single STAC-based collection object as defined by the openEO API (`GET /collections/{collection_id}`).
- `mapOptions` (object): For fine-tuning the behavior of the map that displays the collection's spatial extent. Entirely optional. Possible keys:
  - `height` (string): Height of the map container div. Defaults to `"300px"`.
  - `width` (string): Width of the map container div. Defaults to `"auto"`.
  - `wrapAroundAntimeridian` (boolean): Whether the world map wraps around the antimeridian (defined the other way round it's also known as "noWrap"). Defaults to `false`.
  - `scrollWheelZoom` (boolean): Whether zooming via the mouse scroll wheel is enabled (regardless of this setting, buttons for `+` and `-` are _always_ displayed). Defaults to `true`.
  - `onAfterMapInit` (function|null): Callback function with two parameters `map` (Leaflet Map) and `rectangles` (Bounding Boxes as Leaflet Rectangle or Leaflet Wrapped Polygon in a Leaflet FeatureGroup) that is called after the map has been initialized. Can be used to further customize the map behavior. Defaults to `null` (no callback).

**Slots:**

- `title`: HTML to display as the main heading.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.
- `spatial-extents`: HTML to display the spatial extents, e.g. a map. The slot property `extents` provides an array of arrays, each containing four elements (west, south, east, north) with the WGS84 coordinates.
- `temporal-extents`: HTML to display the temporal extents. The slot property `extents` provides an array of arrays, each with two elements (start, end). Both are RFC3339 compatible `date-time`, or `null` to indicate an open range.


### `Collections`

Shows an (expandable) list of all STAC-based collections available at a back-end.

**Properties:**

- `collections` (array, required): An array of STAC-based collection objects as defined by the openEO API (`GET /collections`, property `collections`).
- `mapOptions` (object): See the corresponding prop in `Collection`. By default, `scrollWheelZoom` is set to `false`.
- `searchTerm` (string|null): See the prop `externalSearchTerm` in `SearchableList`. 
- `sort` (boolean): See the corresponding prop in `SearchableList`. 
- `allowExpand` (string): See the corresponding prop in `SearchableList`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Collections`.


### `DeprecationNotice`

Show a message that something has been deprecated.

**Properties:**

- `entity` (string): A noun that describes the entity that has been deprecated, e.g. `process` or `collection`.


### `Description`

A simple text renderer, which supports CommonMark.

**Properties:**
- `description` (string, required): The text to show.
- `preprocessor` (function|null): A function that further processes the text, *before* CommonMark is parsed. Defaults to `null`.
- `processor` (function|null): A function that further processes the text, *after* CommonMark is parsed. Defaults to `null`.
- `processUrl` (string): The URL to point process references (` ``process_id()`` `) to. `${}` gets replaced with the process id. Set to `null` (default) to disable process links. Example: `https://processes.openeo.org/#${}`
- `compact` (boolean): Renders the description more compact if set to `true`. Defaults to `false`.
- `allowHTML` (boolean): By default (`false`), HTML is removed from the rendered version. To show HTML set this to `true`. Only set to `true` if you trust the content, it may contain insecure elements.


### `ExperimentalNotice`

Show a message that something is experimental.

**Properties:**

- `entity` (string): A noun that describes the entity that is still experimental, e.g. `process` or `collection`.


### `FileFormat`

Visualizes a single supported file format of the back-end.

**Properties:**

The properties must be filled with parts of the response for supported file formats as defined by the openEO API (`GET /file_formats`). Returned is an object like `{ input: { GTiff: {...} }, output: { PNG: {...} } }` and some of the keys and values must be passed.

- `id` (string, required): The identifier of the file format (i.e. the key of the second level; `GTiff` or `PNG` in the example above)
- `format` (object, required): The file format specification (i.e. the value of the second level; `{...}` in the example above)
- `type` (boolean, required): Either `input` or `output` (i.e. the key of the first level)

**Slots:**

- `title`: HTML to display as the main heading.
- `badges`: HTML to display as the badges.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.


### `FileFormats`

Visualizes all supported file formats of the back-end.

**Properties:**

- `formats` (object, required): Supported file formats as defined by the openEO API (`GET /file_formats`).
- `showInput` (boolean): Show the input file formats. Defaults to `true`.
- `showOutput` (boolean): Show the output file formats. Defaults to `true`.
- `searchTerm` (string|null): See the prop `externalSearchTerm` in `SearchableList`. 
- `sort` (boolean): See the corresponding prop in `SearchableList`. 
- `allowExpand` (string): See the corresponding prop in `SearchableList`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `File Formats`.

*Note: At least one of `showInput` or `showOutput` must be set to `true`. Otherwise, the list will be empty.*


### `JsonSchema`

Renders JSON Schemas in a way that it's a bit easier for humans to read.

**Properties:**

- `schema` (object|array\<object>, required): Either a single JSON Schema as object or an array of JSON Schema objects.
- `processUrl` (string): See the corresponding prop in `Description`. 

### `LinkList`

A simple list of links.

**Properties:**

- `links` (array\<object>, required): An array of objects, each describing a link as defined by the openEO API.
- `sort` (boolean): Sort the links by title. Defaults to `true`.
- `heading` (string|null): If given, a heading is shown above the list. Defaults to `null` (no heading shown).
- `headingTag` (string): HTML Tag to use for the heading. Defaults to `strong`.
- `ignoreRel`: (array\<string>): List of `rel` types to hide. Defaults to `['self']`.
- `showRel`: (boolean): If set to `true`, shows the `rel` types. Defaults to `false`.


### `ObjectTree`

Renders JavaScript objects in a more human-readable form.
Often used as a fallback if no other form of presentation is known by the client.

**Properties:**

- `data` (object): Any object (i.e. object, array or null)
- `collapseAfter` (integer|null): The number of elements to display for each object or array until a "show all" button is shown. Set to `null` to show all elements. Defaults to `10`.


### `Process`

Visualizes a single process following the openEO process description.

**Properties:**

- `process` (object, required): Process specification as defined by the openEO API (Either one of the array elements in the property `processes` returned by `GET /process` or the response from `GET /process_graphs/{process_graph_id}`).
- `provideDownload` (boolean): Provide a link to download the JSON file (defaults to `true`).
- `processUrl` (string): See the corresponding prop in `Description`.

**Slots:**

- `title`: HTML to display the main heading.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.


### `Processes`

Shows an (expandable) list of all processes available at a back-end.

**Properties:**

- `processes` (array, required): An array of processes as defined by the openEO API (`GET /processes` or `GET /process_graphs` although the latter is usually not complete).
- `provideDownload` (boolean): See the corresponding prop in `Process`.
- `processUrl` (string): See the corresponding prop in `Description`.
- `searchTerm` (string|null): See the prop `externalSearchTerm` in `SearchableList`. 
- `sort` (boolean): See the corresponding prop in `SearchableList`. 
- `allowExpand` (string): See the corresponding prop in `SearchableList`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Processes`.


### `SearchableList`

A template to implement searchable, sortable and collapsible lists (all optional).

**Properties:**

- `data` (array<object>|object, required): The data to show in the list. Usually an array, but if an object is given the key of the elements is used as the default identifier. Each value of the array or object must be an object.
- `identifierKey` (string|null): The key in the object to use as identifiers (first line of the list). If not `null`, overrides the default identifier set from object keys. Defaults to `id`.
- `summaryKey` (string|null): The key in the object to use as summary (second line of the list). If set to `null`, no summary is shown. Defaults to `summary`.
- `externalSearchTerm` (string|null): Pass a string if a search term is injected from an external source and no search box should be shown. Default to `null`, which will show a search box in the component itself so that users can filter the data by identifier and summary.
- `searchPlaceholder` (string): A text to show as a placeholder in the search box. Defaults to `Search`.
- `sort` (boolean): Sort the data by identifier. Defaults to `true`.
- `allowExpand` (boolean): If set to `false`, the data can't be expanded and no details will be shown. Defaults to `true`, which will show what has been defined in the `details` slot after a user has expanded the element.
- `showSummaryOnExpand` (boolean): If set to `false`, the summary gets hidden for expanded elements. Defaults to `true`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `null`.
- `searchMinLength` (integer): The number of characters required to be given until the search starts. Defaults to `2` as it's usually not very meaningful to search for a single character.

**Slots:**

- `heading`: HTML to display the heading, which by default consists of a title (see property `heading`) and the count of elements available in total. Will also show the count of elements matching the search term, if a search term has been given. The following slot properties are made available:
	- `filteredCount` (integer|null): The count of elements matching the search term. `null` if no search term has been specified and all elements are shown.
	- `totalCount` (integer): The total count of elements.
- `summary`: HTML to display for the overview of the list element (includes identifier and summary). The following slot properties are made available:
	- `summary` (object): An object with some high-level information for the list element: `identifier`, `summary`, `show` and `index`. This is what you usually want to show here.
	- `item` (object): The original object from `data` for the list element.
- `details`: HTML to display for the details of the list element. This is what is shown after an element has been expanded. The following slot properties are made available:
	- `summary` (object): An object with some high-level information for the list element: `identifier`, `summary`, `show` and `index`.
	- `item` (object): The original object from `data` for the list element. This is what you usually want to show here.


### `ServiceType`

Visualizes a single secondary web service supported by the back-end.

**Properties:**

The properties must be filled with parts of the response for supported secondary web services as defined by the openEO API (`GET /service_types`). Returned is an object like `{ WMS: {...}, WFS: {...} }` and one of the keys and values must be passed to the component.

- `id` (string, required): The identifier of the secondary web service (i.e. a key of the object; `WMS` or `WFS` in the example above)
- `service` (object, required): The secondary web service specification (i.e. the value for the corresponding key; `{...}` in the example above)

**Slots:**

- `title`: HTML to display as the main heading.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.


### `ServiceTypes`

Visualizes all secondary web services supported by the back-end.

**Properties:**

- `services` (object, required): Supported secondary web services as defined by the openEO API (`GET /service_types`).
- `searchTerm` (string|null): See the prop `externalSearchTerm` in `SearchableList`. 
- `sort` (boolean): See the corresponding prop in `SearchableList`. 
- `allowExpand` (string): See the corresponding prop in `SearchableList`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Secondary Web Services`.


### `SupportedFeatures`

Visualizes the supported functionalities of the back-end.

**Properties:**

- `endpoints` (array, required): Supported endpoints as defined by the openEO API (`GET /capabilities`, property `endpoints`).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Supported Functionalities`.


### `Tabs` and `Tab`

Creates a tab interface. 

#### `Tabs`

**Properties:**

- `id` (string, required): A unique identifier for the tab container.
- `pills` (boolean, default `false`): Switch between [normal boxed tabs and tabs with pills styling](https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp).
- `position` (string, default `top`): Position of the tabs/pills, either `top` or `bottom`.

**Methods:**

- `addTab(name, icon = null, data = null, id = null, selected = false, closable = false, show = null, hide = null, close = null, allowShow = null)`: Adds a new dynamic tab programatically, which is enabled by default.
	- `name` (string): The title of the tab.
	- `icon` (string): A [FontAwesome icon identifier](https://fontawesome.com/icons?d=gallery&s=solid&m=free), e.g. `fa-address-book`. `null` to show no icon.
	- `data` (any): Additional data that is passed to the tab.
	- `id` (string): An id for the tab. Specifying `null` generates an id.
	- `selected` (boolean): If set to `true`, the tab is getting selected and the active tab is set hidden.
	- `closable` (boolean): Set to `true` to show a close symbol, which can be used to close/remove the tab.
	- `show` (function): Function that is called when the tab is about to be shown. The tab is passed as a parameter to the function.
	- `hide` (function): Function that is called when the tab is about to be hidden. The tab is passed as a parameter to the function.
	- `close` (function): Function that is called when the tab is about to be closed. The tab is passed as a parameter to the function.
	- `allowShow` (function): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as a parameter.
- `getTab(id)`: Get the Vue `Tab` instance by id. Returns `null` if not found.
- `getActiveTabId()`: Get the id of the tab that is currently active. 
- `selectTab(tab)`: Set the currently active tab (asynchronously). `tab` can be either a Vue `Tab` instance or the id of a tab.
- `resetActiveTab(force = false)`: Selects the first tab if no tab is selected yet or `force` is set to `true`.
- `closeTab(tab)`: Removes the specified tab. `tab` can be either a Vue `Tab` instance or the id of a tab.

**Slots:**

- `default`: Place for `Tab` components to be added by default. Must only contain children of type `Tab` which contain the content for each of the tabs. The slot property `tabs` holds a reference to the `Tabs` component.
- `tabName`: A slot that can be used to customize the appearance of the tab name for each tab. The slot applies to *all* tabs. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.
- `dynamic`: Default content for dynamic tabs. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.
- The content for each dynamic tab that is added programmatically via the `addTab` method can also be filled with a slot that has the id of the tab (see example below). Otherwise the content of the `dynamic` slot is used. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.

**Notes:**

The component allows to hide the tab label texts if an icon is specified and not enough space is available. Therefore, the component listens to a `windowResized` event. To react on window size changes, you have to add the following code into the `mounted()` method of your central Vue component:

```js
window.addEventListener('resize', event => {
	this.$root.$emit('windowResized', event);
});
```

#### `Tab`

**Properties:**

- `id` (string, required): A unique identifier for the tab.
- `name` (string, required): The title of the tab.
- `icon` (string, default `null`): A [FontAwesome icon identifier](https://fontawesome.com/icons?d=gallery&s=solid&m=free), e.g. `fa-address-book`. `null` to show no icon.
- `selected` (boolean, default `false`): A single tab of a group should be selected by default by setting this property to `true`.
- `enabled` (boolean, default `true`): Set to `false` to hide the tab completely from the user.
- `closable` (boolean, default `false`): Set to `true` to show a close symbol, which can be used to close/remove the tab.
- `allowShow` (function, default `null`): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as a parameter.

**Slots:**

- `default`: Place for the content of your tab. The slot property `tab` holds a reference to the `Tab` component.

**Events:**

- `@show`: Fired when the tab is shown. The tab is passed as a parameter to the listener.
- `@hide`: Fired when the tab was hidden. The tab is passed as a parameter to the listener.
- `@close`: Fired when the tab has been closed. The tab is passed as a parameter to the listener.


#### Examples

##### Simple example with three static tabs

```html
<template>
	<Tabs id="viewerContent">
		<Tab id="news" name="News" icon="fa-newspaper" :selected="true">
			Add the most recent news here.
		</Tab>
		<Tab id="docs" name="Documentation" icon="fa-books">
			Add the documentation here.
		</Tab>
		<Tab id="contact" name="Contact" icon="fa-envelope">
			Contact me at <a href="mailto:abc@mailprovider.com">abc@mailprovider.com</a>.
		</Tab>
	</Tabs>
</template>

<script>
import Tabs from '@openeo/vue-components/components/Tabs.vue';
import Tab from '@openeo/vue-components/components/Tab.vue';

export default {
	name: 'Viewer',
	components: {
		Tab,
		Tabs
	}
}
</script>
```

##### Dynamically adding tabs + custom tab names appearance

```html
<template>
	<Tabs id="viewerContent" ref="tabs">
		<template #default>
			<!-- The content for map tab that is added directly when the component is instantiated. -->
			<Tab id="mapView" name="Map" icon="fa-map" :selected="true">
				<template #default="{ tab }">
					<MapViewer id="mapCanvas" ref="mapViewer" :show="tab.active" />
				</template>
			</Tab>
		</template>
		<template #imageView="{ tab }">
			<!-- The content for the dynmaic tab with the id 'imageView' -->
			<ImageViewer :data="tab.data" />
		</template>
		<template #dynamic="{ tab }">
			<!-- The default content for all other dynamic tabs -->
			<DataViewer :data="tab.data" />
		</template>
		<template #tabName="{ tab }">
			<!-- How to render the tab name, e.g. all upper-case -->
			{{ tab.name.toUpperCase() }}
		</template>
	</Tabs>
</template>

<script>
import Tabs from '@openeo/vue-components/components/Tabs.vue';
import Tab from '@openeo/vue-components/components/Tab.vue';
import ImageViewer from './ImageViewer.vue';
import DataViewer from './DataViewer.vue';
import MapViewer from './MapViewer.vue'

export default {
	name: 'Viewer',
	components: {
		Tab,
		Tabs,
		DataViewer,
		ImageViewer,
		MapViewer
	},
	methods: {
		addNewTab(data, image = true) {
			if (image) {
				this.$refs.tabs.addTab(
					"Images",
					"fa-image",
					data, //
					"imageView", // Id of the tab
					true, // Is the tab selected after adding it?
					true // Is the tab closable?
				);
			}
			else {
				this.$refs.tabs.addTab("Data", "fa-database", data, null, true, true);
			}
		}
	}
}
</script>
```

### `UdfRuntime`

Visualizes a single UDF (user-defined function) runtime supported by the back-end.

**Properties:**

The properties must be filled with parts of the response for supported UDF runtime as defined by the openEO API (`GET /udf_runtimes`). Returned is an object like `{ R: {...}, Python: {...} }` and one of the keys and values must be passed to the component.

- `id` (string, required): The identifier of the UDF runtime (i.e. a key of the object; `R` or `Python` in the example above)
- `runtime` (object, required): The UDF runtime specification (i.e. the value for the corresponding key; `{...}` in the example above)
- `version` (string|null): If one of the versions or tags available for the runtime should be pre-selected and shown, specify the version or tag here. By default (`null`), the default version or tag specified by the back-end will be shown.

**Slots:**

- `title`: HTML to display as the main heading.
- `badges`: HTML to display as the badges.
- `before-description`: HTML to display before the description.


### `UdfRuntimes`

Visualizes all UDF (user-defined function) runtimes supported by the back-end.

**Properties:**

- `runtimes` (object, required): Supported UDF runtimes as defined by the openEO API (`GET /udf_runtimes`).
- `searchTerm` (string|null): See the prop `externalSearchTerm` in `SearchableList`. 
- `sort` (boolean): See the corresponding prop in `SearchableList`. 
- `allowExpand` (string): See the corresponding prop in `SearchableList`.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `UDF Runtimes`.


## Other features

*Attention: The following features may get (partially) moved to `@openeo/js-commons` in one of the next beta releases. The documentation may be incomplete, too.*

### `FeatureList`

A list of categorized features with their corresponding endpoints as used by the components `SupportedFeatures`.

### `Utils`

* `compareStringCaseInsensitive(string a, string b) -> integer`: Compares both strings (a) case-insensitive and (b) in natural order. Returns `-1` if `a` is sorted before `b`, `0` if they are equal and `1` otherwise.
* `friendlyLinks(array linkList, boolean sort = true, array ignoreRel = ['self']) -> array`: Accepts an array of links as defined by the openEO API and pre-processes it for better handling in templates. It tries to generate a meaningful title, if not available. It optionally also sorts the links by title and removes links with the given relation types in `ignoreRel`.
* `htmlentities(string str) -> string`: Replace `"`, `'`, `<` and `>` characters in strings with HTML entities.
* `htmlentities_decode(string str) -> string`: Replace the HTML entities for `"`, `'`, `<` and `>` with their respective characters.
* `prettifyAbbreviation(string str) -> string`: Converts a string to uppercase if all letters given are lower-cased.
* `prettifyString(string str) -> string`: Tries to convert strings in snake-case, camel-case or kebab-case into more human-readable texts, mostly by adding spaces.
* and other functions not meant for public use.