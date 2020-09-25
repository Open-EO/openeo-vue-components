# openeo-vue-components

A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

This library's version is **1.0.0-rc.4** and supports **openEO API versions 0.4.x and 1.0.x**. Legacy versions are available as releases.

## Components

Note: Methods, properties and slots not listed here are not meant to be used as public and stable API.

### `BillingPlans`

Visualizes the billing information of the back-end.

**Properties:**
- `version` (string): openEO version
- `billing` (object): Billing information as defined by the openEO API.

**Methods:**

- `getPlanCount()` - Get the number of billing plans.


### `Capabilities`

Visualizes all the server information of the back-end. Shows the title, description, back-end version, `SupportedFeatures` and `BillingPlans`. May add `FileFormats`, `ServiceTypes` and `UdfRuntimes`.

**Properties:**
- `capabilities` (object): Capabilities response as defined by the openEO API.
- `url` (string): URL to the API
- `serviceTypes` (object): If given, shows the supported web service types.
- `fileFormats` (object): If given, shows the supported file formats (input and output).
- `udfRuntimes` (object): If given, shows the supported UDF runtimes.


### `Collection`

Visualizes a collection following the STAC-based collection description.

**Optional dependencies:**

This component has two optional dependencies to show the spatial extents of the collection on a map:
- `leaflet` - mapping library
- `leaflet.antimeridian` - plugin to correctly show bounding boxes spanning over the antimeridian

You can either install them using npm or add them to your HTML page:
```html
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.6/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet.antimeridian@1/dist/leaflet.antimeridian-src.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.6/dist/leaflet.css" />
```

**Properties:**

- `version` (string): openEO version (defaults to `null`, which tries to auto-detect the version).
- `collectionData` (object): A single STAC-based collection object as defined by the openEO API.
- `initiallyCollapsed` (boolean): Allow collapsing/expanding the details and collapse the details by default (defaults to `false`).
- `mapOptions` (object): For fine-tuning the behaviour of the map that displays the collection's spatial extent. Entirely optional. Possible keys:
  - `height` (string): Height of the map container div. Defaults to `"300px"`.
  - `width` (string): Width of the map container div. Defaults to `"auto"`.
  - `wrapAroundAntimeridian` (boolean): Whether the world map wraps around the antimeridian (defined the other way round it's also known as "noWrap"). Defaults to `false`.
  - `scrollWheelZoom` (boolean): Whether zooming via the mouse scroll wheel is enabled (regardless of this setting, buttons for `+` and `-` are _always_ displayed). Defaults to `true`.
  - `onAfterMapInit` (function): Callback function with two parameters `map` (Leaflet Map) and `rectangles` (Bounding Boxes as Leaflet Rectangle or Leaflet Wrapped Polygon in a Leaflet FeatureGroup) that is called after the map has been initialized. Can be used to further customize the map behavior. Defaults to no callback.

**Slots:**

- `collection-before-summary`
- `collection-after-summary`
- `collection-before-details`
- `collection-after-details`
- `collection-spatial-extents` - Custom HTML to display the spatial extents, e.g. a map. The variable `extents` provides an array of arrays, each containing four elements (west, south, east, north) with the WGS84 coordinates.
- `collection-temporal-extents` - Custom HTML to display the temporal extents. The variable `extents` provides an array of arrays, each with two elements (start, end). Both are RFC3339 compatible `date-time`, or `null` to indicate an open range.


### `Description`

A simple text renderer, which supports CommonMark.

**Properties:**
- `description` (string): The text to show.
- `preprocessor` (function): A function that further processes the text, *before* CommonMark is parsed.
- `processor` (function): A function that further processes the text, *after* CommonMark is parsed.
- `processUrl` (string): The URL to point process references (` ``process_id()`` `) to. `${}` gets replaced with the process id. Set to `null` (default) to disable process links. Example: `https://processes.openeo.org/#${}`
- `compact` (boolean): Renders the description more compact if set to `true`. Defaults to `false`.


### `EventBusMixin`

A Mixin for components to manage EventBus listeners across the lifecycle of your components.

After importing the Mixin, include it in your component by adding `mixins: [EventBusMixin],`. This components helps to keep track of events over the lifecycle of components. It removes all event listeners after the listening component has been destroyed. This ensures that no old listeners are called and produce errors due to missing data. The Mixin also ensures that listeners are not added twice.

**Methods:**

- `listen(eventName, callback)` - Adds a listener for an event with the specified name. Replaces existing listeners with the same name in the component.
- `emit(eventName, ...args)` - Emits an event with the specified name and arguments.


### `FileFormats`

Visualizes the supported file formats of the back-end.

**Properties:**

- `version` (string): openEO version
- `formats` (object): Supported file formats as defined by the respective version of the openEO API.
- `showInput` (boolean): Show the input file formats. Defaults to `false`.
- `showOutput` (boolean): Show the output file formats. Defaults to `false`.

One of `showInput` or `showOutput` must be set to `true`, otherwise the list will be empty. If both are set to `true`, a single list will be shown.

**Methods:**

- `getCount()` - Get the number of shown file formats.


### `LinkList`

A simple list of links.

**Properties:**

- `links` (array\<object>): An array of objects, each describing a link as defined by the openEO API.
- `sort` (boolean): Sort the links by title. Defaults to `true`.
- `heading` (string): If given, a heading is shown above the list. Defaults to `null` (no heading shown).
- `headingTag` (string): HTML Tag to put the heading into. Defaults to `strong`.
- `ignoreRel`: (array\<string>): List of `rel` types to hide. Defaults to `['self']`.
- `showRel`: (boolean): Shows/Hides the `rel` types. Defaults to `false`.

**Methods:**

- `getCount()` - Get the number of shown links.


### `ObjectTree`

Renders JavaScript objects in a more human-readable form.
Often used as a fallback if no other form of presentation is known by the client.

**Properties:**

- `data` (object): Any object (i.e. objects, arrays, null)


### `Process`

Visualizes a process following the openEO process description in the latest version.

Note: `ProcessExample` is not meant to be used separately.

**Properties:**

- `version` (string): openEO version (defaults to `null`, which tries to auto-detect the version).
- `processData` (object): Process specification as defined by the openEO API.
- `provideDownload` (boolean): Provide a link to download the JSON file (defaults to `true`).
- `initiallyCollapsed` (boolean): Allow collapsing/expanding the details and collapse the details by default (defaults to `false`).
- `processReferenceBuilder` (function): A function that generates a link to a process by its process identifier.

**Slots:**

- `process-before-summary`
- `process-after-summary`
- `process-before-details`
- `process-after-details`


### `ServiceTypes`

Visualizes the supported secondary web service types of the back-end.

**Properties:**

- `version` (string): openEO version
- `services` (object): Supported service types as defined by the openEO API.

**Methods:**

- `getCount()` - Get the number of shown service types.


### `SupportedFeatures`

Visualizes the supported functionalities of the back-end.

**Properties:**

- `version` (string): openEO version
- `endpoints` (object): Supported endpoints as defined by the openEO API.

**Methods:**

- `getFeatures()` - Get a list of features (i.e. the categories).
- `getFeatureCount()` - Get the number of supported and unsupported features that are shown by the component.
- `getSupportedFeatureCount()` - Get the number of supported features by the back-end.


### `Tabs` and `Tab`

Creates a tab interface. 

#### `Tabs`

**Properties:**

- `id` (string, required): A unique identifier for the tab container.
- `pills` (boolean, default `false`): Switch between [normal boxed tabs and tabs with pills styling](https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp).
- `position` (string, default `top`): Position of the tabs/pills, either `top` or `bottom`.

**Methods:**

- `addTab(name, icon = null, data = null, id = null, selected = false, closable = false, show = null, hide = null, close = null, allowShow = null)` - Adds a new dynamic tab programatically, which is enabled by default.
	- `name` (string): The title of the tab.
	- `icon` (string): A [FontAwesome icon identifier](https://fontawesome.com/icons?d=gallery&s=solid&m=free), e.g. `fa-address-book`. `null` to show no icon.
	- `data` (any): Additional data that is passed to the tab.
	- `id` (string): An id for the tab. Specifying `null` generates an id.
	- `selected` (boolean): If set to `true`, the tab is getting selected and the active tab is set hidden.
	- `closable` (boolean): Set to `true` to show a close symbol, which can be used to close/remove the tab.
	- `show` (function): Function that is called when the tab is about to be shown. The tab is passed as parameter to the function.
	- `hide` (function): Function that is called when the tab is about to be hidden. The tab is passed as parameter to the function.
	- `close` (function): Function that is called when the tab is about to be closed. The tab is passed as parameter to the function.
	- `allowShow` (function): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as parameter.
- `getTab(id)` - Get the Vue `Tab` instance by id. Returns `null` if not found.
- `getActiveTabId()` - Get the id of the tab that is currently active. 
- `selectTab(tab)` - Set the currently active tab (asynchronously). `tab` can be either a Vue `Tab` instance or the id of a tab.
- `resetActiveTab(force = false)` -  Selects the first tab if no tab is selected yet or `force` is set to `true`.
- `closeTab(tab)` - Removes the specified tab. `tab` can be either a Vue `Tab` instance or the id of a tab.

**Slots:**

- `default` - Place for `Tab` components to be added by default. Must only contain children of type `Tab` which contain the content for each of the tabs. The variable `tabs` holds a reference to the `Tabs` component.
- `tabName` - Slot that can be used to customize the appearance of the tab name for each tab. The slot applies to *all* tabs. The variable `tab` holds an object with the properties of the tab set with the `addTab` method.
- `dynamic` - Default content for dynamic tabs. The variable `tab` holds an object with the properties of the tab set with the `addTab` method.
- The content for each dynamic tab that is added programattically via the `addTab` method can also be filled with a slot that has the id of the tab (see example below). Otherwise the content of the `dynamic` slot is used. The variable `tab` holds an object with the properties of the tab set with the `addTab` method.

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
- `allowShow` (function, default `null`): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as parameter.

**Slots:**

- `default` - Place for the content of your tab. The variable `tab` holds a reference to the `Tab` component.

**Events:**

- `@show` - Fired when the tab is shown. The tab is passed as parameter to the listener.
- `@hide` - Fired when the tab was hidden. The tab is passed as parameter to the listener.
- `@close` - Fired when the tab has been closed. The tab is passed as parameter to the listener.


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
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';

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
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';
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

### `UdfRuntimes`

Visualizes the supported UDF (user-defined function) runtimes of the back-end.

**Properties:**

- `version` (string): openEO version
- `runtimes` (object): Supported UDF runtimes as defined by the openEO API.

**Methods:**

- `getCount()` - Get the number of shown UDF runtimes.

### `UdfRuntime`

Shows a single supported UDF (user-defined function) runtime of the back-end.

**Note:** Unlike many other components, this component doesn't automatically migrate legacy API responses.
You must pass the runtime data through `MigrateCapabilities.convertUdfRuntimesToLatestSpec` before passing it to this component.

**Properties:**

- `runtimeId` (string): The identifier of the runtime (the key of a runtime entry in the `GET /udf_runtimes` response).
- `runtimeData` (object): The data associated with this runtime (the value of a runtime entry in the `GET /udf_runtimes` response).
- `runtimeVersion` (string): If a specific version of the runtime should be pre-selected, specify it here. Defaults to `null`, which shows the pre-selects the default version.


## Other features

### `FeatureList`

A list of categorized features with their corresponding endpoints as used by the components `SupportedFeatures`.

### `Utils`

* `compareStringCaseInsensitive(string a, string b) : integer` - Compares both strings (a) case-insensitive and (b) in natural order. Returns `-1` if `a` is sorted before `b`, `0` if they are equal and `1` otherwise.
* `friendlyLinks(array linkList, boolean sort = true, array ignoreRel = ['self']) : array` - Accepts an array of links as defined by the openEO API and pre-processes it for better handling in templates. It tries to generate a meaningful title, if not available. It optionally also sorts the links by title and removes links with the given relation types in `ignoreRel`.
* `htmlentities(string str) : string` - Replace `"`, `'`, `<` and `>` characters in strings with HTML entities.
* `htmlentities_decode(string str) : string` - Replace the HTML entities for `"`, `'`, `<` and `>` with their respective characters.
* `prettifyAbbreviation(string str) : string` - Converts a string to uppercase if all letters given are lower-cased.
* `prettifyString(string str) : string` - Tries to convert strings in snake-case, camel-case or kebab-case into more human-readable texts, mostly by adding spaces.
* and other functions not meant for public use.