# openeo-vue-components

A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

This library's version is **0.4.1** and supports **openEO API versions 0.3.x and 0.4.x**. Legacy versions are available as releases.

## Components

### `BillingPlans`

Visualizes the billing information of the back-end.

**Properties:**
- `version` (string): openEO version
- `billing` (object): Billing information as defined by the openEO API.


### `Capabilities`

Visualizes all the server information of the back-end. Shows the title, description, back-end version, `SupportedFeatures` and `BillingPlans`.

**Properties:**
- `capabilities` (object): Capabilities response as defined by the openEO API.


### `Collection`

Visualizes a collection following the STAC-based collection description.

**Properties:**

- `version` (string): openEO version (defaults to `null`, which tries to auto-detect the version).
- `collectionData` (object): A single STAC-based collection object as defined by the openEO API.
- `initiallyCollapsed` (boolean): Allow collapsing/expanding the details and collapse the details by default (defaults to `false`).

**Slots:**

- `collection-before-summary`
- `collection-after-summary`
- `collection-before-details`
- `collection-after-details`
- `collection-spatial-extent` - Custom HTML to display the spatial extent, e.g. a map. The variable `extent` is provides an array containing four elements (west, south, east, north) with the WGS84 coordinates.
- `collection-temporal-extent` - Custom HTML to display the temporal extent. The variable `extent` is provides an array with two elements (start, end). Each is a RFC3339 compatible `date-time` or `null` to indicate an open range.


### `Description`

A simple text renderer, which supports CommonMark.

**Properties:**
- `description` (string): The text to show.
- `preprocessor` (function): A function that further processes the text, before CommonMark is parsed.
- `compact` (boolean): Renders the description more compact if set to `true`. Defaults to `false`.


### `LinkList`

A simple list of links.

**Properties:**

- `links` (array\<object>): An array of objects, each describing a link as defined by the openEO API.


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


### `SupportedFeatures`

Visualizes the supported functionalities of the back-end.

**Properties:**

- `version` (string): openEO version
- `endpoints` (object): Supported endpoints as defined by the openEO API.


### `SupportedFileFormats`

Visualizes the supported output file formats of the back-end.

**Properties:**

- `version` (string): openEO version
- `formats` (object): Supported output formats as defined by the openEO API.


### `SupportedServiceTypes`

Visualizes the supported secondary web service types of the back-end.

**Properties:**

- `version` (string): openEO version
- `services` (object): Supported service types as defined by the openEO API.


### `Tabs` and `Tab`

Creates a tab interface. 

#### `Tabs`

**Properties:**

- `id` (string, required): A unique identifier for the tab container.
- `pills` (boolean, default `false`): Switch between [normal boxed tabs and tabs with pills styling](https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp).

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
- `closeTab(tab)` - Removes the specified tab. `tab` can be either a Vue `Tab` instance or the id of a tab.

**Slots:**

- `default` - Place for `Tab` components to be added by default. Must only contain children of type `Tab` which contain the content for each of the tabs. The variable `tabs` holds a reference to the `Tabs` component.
- `dynamic` - Default content for dynamic tabs. The variable `tab` holds an object with the properties of the tab set with the `addTab` method.
- The content for each dynamic tab that is added programattically via the `addTab` method can also be filled with a slot that has the id of the tab (see example below). Otherwise the content of the `dynamic` slot is used. The variable `tab` holds an object with the properties of the tab set with the `addTab` method.

**Notes:**

The component allows to hide the tab label texts if an icon is specified and not enough space is available. Therefore, the component listens to a `windowResized` event using the `EventBus`. To react on window size changes, you have to add the following code into the `mounted()` method of your central Vue component:

```js
window.addEventListener('resize', event => {
	EventBus.$emit('windowResized', event);
});
```

####  `Tab`

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

- `@show` - Fired when the tab is about to be shown. The tab is passed as parameter to the listener.
- `@hide` - Fired when the tab is about to be hidden. The tab is passed as parameter to the listener.
- `@close` - Fired when the tab is about to be closed. The tab is passed as parameter to the listener.


#### Examples

##### Simple example with three static tabs

```
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

##### Dynamically adding tabs

```
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


## Other features

### `EventBus`

A very simple Event handler, which you can emit and receive messages with. Use the following methods:

* `$emit` -  see https://vuejs.org/v2/api/#vm-emit
* `$on` - see https://vuejs.org/v2/api/#vm-on
* `$once` - see https://vuejs.org/v2/api/#vm-once
* `$off` - see https://vuejs.org/v2/api/#vm-off

### Utils

* `htmlentities(str) : str` - Replace `"`, `'`, `<` and `>` in strings with HTML entities.
* `isNumeric(val) : bool` - Returns whether a string or number is numeric and finite.
* and other functions not meant for public use.