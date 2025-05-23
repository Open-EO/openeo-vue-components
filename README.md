# Vue Components for openEO <!-- omit in toc -->

A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

This library's version is [**2.20.0**](CHANGELOG.md) and supports **openEO API versions 1.x.x**.
Legacy versions supporting API version 0.x are available as [releases](https://github.com/Open-EO/openeo-vue-components/releases).

npm: [@openeo/vue-components](https://www.npmjs.com/package/@openeo/vue-components)

Examples: <https://open-eo.github.io/openeo-vue-components/>

**Table of Contents:**

- [Usage](#usage)
	- [HTML](#html)
	- [FontAwesome](#fontawesome)
	- [Vue](#vue)
- [Components](#components)
	- [`BillingPlans`](#billingplans)
	- [`Capabilities`](#capabilities)
	- [`Collection`](#collection)
	- [`Collections`](#collections)
	- [`DataTable`](#datatable)
	- [`DeprecationNotice`](#deprecationnotice)
	- [`FederationMissingNotice`](#federationmissingnotice)
	- [`Description`](#description)
	- [`ExperimentalNotice`](#experimentalnotice)
	- [`FileFormat`](#fileformat)
	- [`FileFormats`](#fileformats)
	- [`JsonSchema`](#jsonschema)
	- [`Item`](#item)
	- [`Items`](#items)
	- [`Job`](#job)
	- [`JobEstimate`](#jobestimate)
	- [`LinkList`](#linklist)
	- [`Logs`](#logs)
	- [`ModelBuilder`](#modelbuilder)
	- [`ObjectTree`](#objecttree)
	- [`Process`](#process)
	- [`Processes`](#processes)
	- [`SearchableList`](#searchablelist)
	- [`SearchBox`](#searchbox)
	- [`Service`](#service)
	- [`ServiceType`](#servicetype)
	- [`ServiceTypes`](#servicetypes)
	- [`SupportedFeatures`](#supportedfeatures)
	- [`Tabs` and `Tab`](#tabs-and-tab)
		- [`Tabs`](#tabs)
		- [`Tab`](#tab)
		- [Examples](#examples)
			- [Simple example with three static tabs](#simple-example-with-three-static-tabs)
			- [Dynamically adding tabs + custom tab names appearance](#dynamically-adding-tabs--custom-tab-names-appearance)
	- [`UdfRuntime`](#udfruntime)
	- [`UdfRuntimes`](#udfruntimes)
- [Other features](#other-features)
	- [`FeatureList`](#featurelist)
	- [`Utils`](#utils)

## Usage

All components listed below can be used in two different environments: 
Directly as HTML tag in an HTML page or in a Vue environment as normal Single File Components (SFC).

### HTML

To use the components in HTML (as so-called 'Web Components'), simply include the following into the `head` of your HTML page:

```html
<script src="https://cdn.jsdelivr.net/npm/@openeo/vue-components@2/assets/openeo.min.js"></script>
```

All components can be used as HTML tags in kebab-case, prefixed with `openeo-`. Also, ALL parameters must be converted to kebab-case too!
For example, the component [`BillingPlans`](#billingplans) can be used as `<openeo-billing-plans></openeo-billing-plans>`.
Props can be passed as HTML attributes if the value is a scalar.
For arrays and objects, you have to specify them as child `script` tags with the attributes `prop="..."` and `type="application/json"`.

For example, the [`Capabilities`](#capabilities) component can be used as follows:
```html
<openeo-capabilities url="https://example.com/api">
	<script prop="capabilities" type="application/json">
		{
			"api_version": "1.0.0",
			...
		}
	</script>
</openeo-capabilities>
```

The components are async web components, which means only the components you are actually using are requested. This keeps page loading times at a minimum.

*Note for Contributors:* Web Components must be built via `npm run build` and will be placed in the `assets` folder. Examples can be generated using `npm run wc-examples` and will be placed in the `examples` folder. You can also serve the examples via HTTP with the command `npm run wc-serve`.

### FontAwesome

To display a nice user interface, some components use icons from the project [Font Awesome](https://fontawesome.com).
Unfortunately, fonts can't be loaded in Web Components so you need to embed them directly in the `head` of your HTML page as follows:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://use.fontawesome.com/releases/v5.13.0/webfonts/fa-solid-900.woff2" />
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css" type="text/css" media="all" />
```

The components that use such icons and need these additional files mention it in their descriptions below.

**Note:** This is not required in Vue environments, which will load the required files automatically.

### Vue

In a Vue environment, you can just import the Single File Components (SFC) directly. I.e., they must be imported from the `components` folder as demonstrated below.

First, you need to install the package: `npm install @openeo/vue-components --save`
Now, you can import the Vue components with the `import` or `require`, depending on the module system you are using.

For example, the [`Capabilities`](#capabilities) component can be imported as follows:
* `const Capabilities = require('@openeo/vue-components/components/Capabilities.vue');` (Node.js require)
* `import Capabilities from '@openeo/vue-components/components/Capabilities.vue';` (ES6 modules)

Afterwards, you need to declare the component in the `components` section of your SFC, e.g. `components: { Capabilities }`.

In the Template of your SFC you can now include the component as shown in the example below. Please note that the values `myUrl` and `myCapabilities` must be defined in the SFC, e.g. in the `data` property or as a `computed` property.

```html
<Capabilities :url="myUrl" :capabilities="myCapabilities"></Capabilities>
```

*Note for Contributors*: This usage mode doesn't require the initial build step `npm run build`. The Vue Components can simply be imported from the `components` folder. You can also serve examples via HTTP with the command `npm run serve`.

## Components

*Note: Methods, properties and slots not listed here are not meant to be used as public and stable API. They can change at any time without prior notice.*

### `BillingPlans`

Visualizes the billing information of the back-end.

**Properties:**

- `billing` (object, required): Billing information as defined by the openEO API (`GET /`, property `billing`).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Billing`.
- `headingTag` / `heading-tag` (string): HTML Tag to use for the heading. Defaults to `h2`.


### `Capabilities`

Visualizes fundamental server information of the back-end. Shows the URL, title, description, version numbers, links, the production flag, [`SupportedFeatures`](#supportedfeatures) and [`BillingPlans`](#billingplans).

**Properties:**

- `capabilities` (object, required): Capabilities response as defined by the openEO API (`GET /`).
- `url` (string): URL to the API. If not set, the URL from the link with relation type `self` is shown. If neither is available, no URL is shown.

### `Collection`

Visualizes a single collection following the STAC-based collection description.

**Properties:**

- `data` (object, required): A single STAC-based collection object as defined by the openEO API (`GET /collections/{collection_id}`).
- `mapOptions` / `map-options` (object): For fine-tuning the behavior of the map that displays the collection's spatial extent. Entirely optional. Possible keys:
  - `height` (string): Height of the map container div. Defaults to `250px`.
  - `width` (string): Width of the map container div. Defaults to `auto`.
  - `basemap` (string): Templated URI for the XYZ basemap. Default to `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`. Please make sure that your usage complies with the [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)!
  - `attribution` (string): Attributon for the basemap. HTML is allowed. Default to `Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>`.
  - `wrapAroundAntimeridian` (boolean): Whether the world map wraps around the antimeridian (defined the other way round it's also known as "noWrap"). Defaults to `false`.
  - `scrollWheelZoom` (boolean): Whether zooming via the mouse scroll wheel is enabled (regardless of this setting, buttons for `+` and `-` are _always_ displayed). Defaults to `false`.
  - `onAfterMapInit` (function|null): Callback function with two parameters `map` (Leaflet Map) and `geometries` (Bounding Boxes as Leaflet Rectangle or Leaflet Wrapped Polygon in a Leaflet FeatureGroup) that is called after the map has been initialized. Can be used to further customize the map behavior. Defaults to `null` (no callback).
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display as the main heading. The component properties are passed through as slot properties with the same names.
- `before-description`: HTML to display before the description. The component properties are passed through as slot properties with the same names.
- `end`: HTML to display after the component. The component properties are passed through as slot properties with the same names.
- `spatial-extents`: HTML to display the spatial extents, e.g. a map. The slot property `extents` provides an array of arrays, each containing four elements (west, south, east, north) with the WGS84 coordinates. The properties `mapOptions` and `worldwide` are also available as slot property.
- `temporal-extents`: HTML to display the temporal extents. The slot property `extents` provides an array of arrays, each with two elements (start, end). Both are RFC3339 compatible `date-time`, or `null` to indicate an open range.


### `Collections`

Shows an (expandable) list of all STAC-based collections available at a back-end.

**Properties:**

- `collections` (array, required): An array of STAC-based collection objects as defined by the openEO API (`GET /collections`, property `collections`).
- `mapOptions` / `map-options` (object): See the corresponding prop in [`Collection`](#collection).
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Collections`.
- `loadAdditionalData` / `load-additional-data` (function|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `showKeywords` / `show-keywords` (boolean): Adds the keywords to the third line of the summary if set to `true`. Defaults to `false`.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the list of collections due to an issue.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `content-start`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `after-search-box`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `collection-before-description`: See the corresponding slot `before-description` in [`Collection`](#collection).
- `collection-end`: See the corresponding slot `end` in [`Collection`](#collection).
- `collection-spatial-extents`: See the corresponding slot `spatial-extents` in [`Collection`](#collection).
- `collection-temporal-extents`: See the corresponding slot `temporal-extents` in [`Collection`](#collection).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


### `DataTable`

A relatively simple table component to show a list of data.

**Warning:** This component is experimental and may change in future releases!

**Properties:**

- `columns` (object, required): The columns to show in the table.
- `data` (array, required): An array of objects containing the data to show.
- `next` (function): Indicates whether more data is available to be loaded/shown and how. Shows a button to load more data into the table and executes the given (async) function. Defaults to `null` (i.e. no more data available).
- `fa` (boolean): Whether to use Font Awesome icons or not. Defaults to `false`.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the table due to an issue.

**Slots:**

- `toolbar`: A place on the top left to show a toolbar, e.g. for "Add" buttons.
- *column-id*: A slot for the column with the name being the column identifer. Can be used to better visualize the values in the column. Passes the slot properties `row`, `col` and `id`.


### `DeprecationNotice`

Show a message that something has been deprecated.

**Properties:**

- `entity` (string): A noun that describes the entity that has been deprecated, e.g. `process` or `collection`.


### `FederationMissingNotice`

Show a message that a response is incomplete due to missing data from an inaccessible service in the federation.

**Properties:**

- `missing` (array, required): The identifiers of the federated back-ends that are not providing data for the list of processes due to an issue.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `retry` (function): Displays a "retry" button which executes the given function. 
- `compact` (boolean): Renders the notice more compact if set to `true`. Defaults to `false`.

**Slots:**

- `button-text`: The content (e.g. text) of the retry button.


### `Description`

A simple text renderer, which supports CommonMark.

**Properties:**
- `description` (string, required): The text to show.
- `preprocessor` (function|null): A function that further processes the text, *before* CommonMark is parsed. Defaults to `null`.
- `processor` (function|null): A function that further processes the text, *after* CommonMark is parsed. Defaults to `null`.
- `processUrl` / `process-url` (string): The URL to point process references (` ``process_id()`` `) to. `${}` gets replaced with the process id. Set to `null` (default) to disable process links. Example: `https://processes.openeo.org/#${}`
- `compact` (boolean): Renders the description more compact if set to `true`. Defaults to `false`.
- `allowHTML` / `allow-html` (boolean): By default (`false`), HTML is removed from the rendered version. To show HTML set this to `true`. Only set to `true` if you trust the content, it may contain insecure elements.


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
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display as the main heading.
- `badges`: HTML to display as the badges.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.

For all slots, the component properties are passed through as slot properties with the same names.


### `FileFormats`

Visualizes all supported file formats of the back-end.

**Properties:**

- `formats` (object, required): Supported file formats as defined by the openEO API (`GET /file_formats`).
- `showInput` / `show-input` (boolean): Show the input file formats. Defaults to `true`.
- `showOutput` / `show-output` (boolean): Show the output file formats. Defaults to `true`.
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `File Formats`.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the list of file formats due to an issue.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

*Note: At least one of `showInput` or `showOutput` must be set to `true`. Otherwise, the list will be empty.*

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `file-format-before-description`: See the corresponding slot `before-description` in [`FileFormat`](#fileformat).
- `file-format-end`: See the corresponding slot `end` in [`FileFormat`](#fileformat).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


### `JsonSchema`

Renders JSON Schemas in a way that it's a bit easier for humans to read.

**Properties:**

- `schema` (object|array\<object>, required): Either a single JSON Schema as object or an array of JSON Schema objects.
- `processUrl` / `process-url` (string): See the corresponding prop in [`Description`](#description).

### `Item`

Visualizes a single STAC Item, e.g. a batch job result.

**Warning:** This component is experimental and may change in future releases!

**Properties:**

- `data` (object, required): A single STAC-based Item object as defined by the openEO API (`GET /jobs/{job_id}/results`).
- `mapOptions` / `map-options` (object): For fine-tuning the behavior of the map that displays the item's geometry. Entirely optional. Possible keys:
  - `height` (string): Height of the map container div. Defaults to `"250px"`.
  - `width` (string): Width of the map container div. Defaults to `"auto"`.
  - `wrapAroundAntimeridian` (boolean): Whether the world map wraps around the antimeridian (defined the other way round it's also known as "noWrap"). Defaults to `false`.
  - `scrollWheelZoom` (boolean): Whether zooming via the mouse scroll wheel is enabled (regardless of this setting, buttons for `+` and `-` are _always_ displayed). Defaults to `false`.
  - `onAfterMapInit` (function|null): Callback function with two parameters `map` (Leaflet Map) and `geometries` (Geometry as Leaflet Geometry or Leaflet Wrapped Geometry in a Leaflet FeatureGroup) that is called after the map has been initialized. Can be used to further customize the map behavior. Defaults to `null` (no callback).
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display as the main heading. The component properties are passed through as slot properties with the same names.
- `before-description`: HTML to display before the description. The component properties are passed through as slot properties with the same names.
- `end`: HTML to display after the component. The component properties are passed through as slot properties with the same names.
- `location`: HTML to display the geometry and/or bbox, e.g. a map. The slot property `geometry` provides a GeoJSON geometry and the slot property `bbox` contains an array with four elements (west, south, east, north) with the WGS84 coordinates. The component property `mapOptions` is also available as slot property.


### `Items`

Shows an (expandable) list of STAC-based Items.

**Warning:** This component is experimental and may change in future releases!

**Properties:**

- `items` (array|object, required): An array of STAC-based Item objects or a GeoJSON FeatureCollection containins STAC Items.
- `showMap` / `show-map` (boolean): Show an overview map with all items. Default to `false`.
- `mapOptions` / `map-options` (object): See the corresponding prop in [`Item`](#item).
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Items`.
- `loadAdditionalData` / `load-additional-data` (function|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the list of items due to an issue.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `content-start`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `after-search-box`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `item-before-description`: See the corresponding slot `before-description` in [`Item`](#item).
- `item-end`: See the corresponding slot `end` in [`Item`](#item).
- `item-location`: See the corresponding slot `location` in [`Item`](#item).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


### `Job`

Visualizes a single batch job.

**Properties:**

- `job` (object, required): Batch Job details as defined by the openEO API (Either one of the array elements in the property `jobs` returned by `GET /jobs` or the response from `GET /jobs/{job_id}`).
- `currency` (string|null): The currency of the service (see openEO API endpoint `GET /`).
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display the main heading.
- `before-description`: HTML to display before the description.
- `process-graph`: See the corresponding slot `process-graph` in [`Process`](#process).
- `end`: HTML to display after the component.

For all slots, the component properties are passed through as slot properties with the same names.


### `JobEstimate`

Visualizes an estimate for a batch job.

**Properties:**

- `estimate` (object, required): Batch Job estimate as defined by the openEO API (response from `GET /jobs/{job_id}/estimate`).
- `currency` (string|null): The currency of the service (see openEO API endpoint `GET /`).


### `LinkList`

A simple list of links.

**Properties:**

- `links` (array\<object>, required): An array of objects, each describing a link as defined by the openEO API.
- `sort` (boolean): Sort the links by title. Defaults to `true`.
- `heading` (string|null): If given, a heading is shown above the list. Defaults to `null` (no heading shown).
- `headingTag` / `heading-tag` (string): HTML Tag to use for the heading. Defaults to `strong`.
- `ignoreRel` / `ignore-rel`: (array\<string>): List of `rel` types to hide. Defaults to `['self']`.
- `showRel` / `show-rel`: (boolean): If set to `true`, shows the `rel` types. Defaults to `false`.


### `Logs`

Show log messages.

**Properties:**

- `logs` (array\<object>): A list of logs as defined by the openEO API (e.g. response from `GET /jobs/{job_id}/logs`, property `logs`).
- `externalSearchTerm` / `external-search-term` (string|null): Pass a string if a search term is injected from an external source and no search box should be shown. Defaults to `null`, which will show a search box in the component itself so that users can filter the logs.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the list of collections due to an issue.


### `ModelBuilder`

Show a process (graph) nicely visualized, includes support for basic editing.

**Note**: This may require to load [FontAwesome](#fontawesome). Also, you should assign the height and width for the Model Builder in the parent HTML tag.

**Warning:** This component is experimental and may change in future releases!

**Properties:**

- `id` (string, required): A document-wide unique identifier for the ModelBuilder instance.
- `editable` (boolean): Allows to edit the model (defaults to `false`). You need to use the `editArguments` event to implement parameter editing.
- `value` / v-model (boolean): The process to show/edit (defaults to an empty object).
- `collections` (array): Allows to add the collections from the API for better visualizations (defaults to an empty array).
- `processes` (array|ProcessRegistry): Allows to add the processes from the API for better visualizations (defaults to an empty array). Can be given as a [`ProcessRegistry`](https://open-eo.github.io/openeo-js-commons/1.4.0/ProcessRegistry.html).
- `parent` (object): The parent `Block` if a Model Builder is shown for a child process (defaults to `null`).
- `parentSchema` / `parent-schema` (object): The schema for the parent parameter if a Model Builder is shown for a child process (defaults to `null`).
- `historySize` / `history-size` (integer): The amount of steps for undo/redo (defaults to `30`)
- `explicitZoom` / `explicit-zoom` (boolean): If set to `true`: The control zooms only if the control has focus or one of the keys `STRG` (Win/*nix) or `Meta` (Mac) has been pressed. Default to `false`, which always scrolls on mouse wheel interaction over the control.
- `height` (string): Set the height of the component as CSS-compatible value, e.g. `400px` or `10rem`. This is especially useful for web components if you can't set a size for the surrounding elements.

**Events:**

- `input(value)` / v-model: Fired when the process has been updated.
- `error(message, title)`: Informs about an error, e.g. to show error messages in the UI.
	- `message` (string): The error message.
	- `title` (string|null): Some errors provide a title, too.
- `showProcess(id, namespace)`: Providing this event will enable a button on each process so that user can click it to get more details. This event is fired when the user has clicked the button. The UI can then show the process details to the user.
	- `id` (string): ID of the process to show
	- `namespace` (string): Namespace of the process
- `showCollection(id)`: Providing this event will enable a button on each collection so that user can click it to get more details. This event is fired when the user has clicked the button. The UI can then show the collection details to the user.
	- `id` (string): ID of a collection to show
- `showParameter(parameter, origin)`: Providing this event will enable a button on each parameter so that user can click it to get more details about the parameter and its schema. This event is fired when the user has clicked the button. The UI can then show the parameter details to the user.
	- `parameter` (object): A process parameter compliant to the openEO API.
	- `origin` (string): Indicates who made the parameter available:
		- `user` if the parameter has been added by the user
		- `schema` if the parameter is coming from the parent process
		- Might return other values in the future.
- `editParameter(parameter, title, saveCallback)`: Providing this event will enable a button on each parameter so that user can click it to edit the parameter. This event is fired when the user has clicked the button. The UI can then show the parameter editor to the user.
	- `parameter` (object): A process parameter compliant to the openEO API.
- `editArguments(parameters, values, title, isEditable, selectParameterName , saveCallback, parentBlock)`: Providing this event will enable a button on each block so that user can click it to get more details about the parameters and corresponding values. This event is fired when the user has clicked the button. The UI can then show the parameter viewer or editor to the user.
	- `parameters` (array\<ProcessParameter>): An array with the details about the parameters, see [`ProcessParameter`](https://open-eo.github.io/openeo-js-commons/1.3.0/ProcessParameter.html) for details.
	- `values` (object): An object with values for the parameters. The keys are the parameter names (`parameters.name`) and the objects are the values for the corresponding parameter.
	- `title` (string): A title for the UI
	- `isEditable` (boolean): Indicates whether the `ModelBuilder` is editable or not, see property `editable`.
	- `selectParameterName` (string|null): If the user has not clicked the general button for the parameter viewer / editor, but instead clicked a specific parameter in the block, it passes the parameter name so that a UI can jump directly to the specific parameter or highlight it.
	- `saveCallback` (function|null): A callback function that is called when the parameter editor indicates that a user wants to persist/save the data. The callback will receive one parameter with the new values in the same format as the `values` parameter above.
	- `parentBlock` (object): The Vue `Block` instance that is the origin of this event.
- `compactMode(enabled)`: Informs about the current state of compact mode.
	- `enabled` (boolean): `true` when compact mode is active, `false` otherwise.
- `historyChanged(history, index)`: The history has been changed, e.g. using `redo`, `undo` or by editing the process in the model builder.
	- `history` (array): The full history.
	- `index` (intener): The index of the element in the history that is currently shown.

**Methods:**

- `async clear() -> boolean`: Clears the process shown (similar effect as setting v-model to `{}`, but also reset edge/block counters).
- `async undo()`: Go one step back in history if available. Otherwise does nothing.
- `async redo()`: Go one step forward in history if available. Otherwise does nothing.
- `async deleteSelected() -> boolean`: Deletes all selected blocks and edges. Returns `true` on success and `false` on faile or if nothing has been selected.
- `async toggleCompact()`: Toggles compact mode (e.g. doesn't show parameter values).
- `perfectScale()`: Fits the view to the blocks and edges so that it is fully shown.
- `getPgParameters() -> array<object>`: Returns all process parameters blocks.
- `async addPgParameter(parameter, origin, position)`: Adds a process parameter block to the model builder.
	- `parameter` (object): The parameter to add, should at least include a `name` and a `schema` as defined by the openEO API.
	- `origin` (string): The origin of the parameter, defaults to `user` for user-defined parameters.
	- `position` (array|null): The position to show the newly created block. Use `getPositionForPageXY` to get the position from a Browser event. Set to `null` (default value) to place it automatically.
- `getPositionForPageXY(x, y) -> array<number>`: Get's the local position in the model builder from the page coordinates (`pageX`, `pageY`) of a Browser event (e.g. mouse). Useful e.g. for the `position` parameters of `addPgParameter` or `addProcess`. Returns the computed x and y coordinates as array.
	- `x` (number): The x coordinate on the page, usually the `pageX` property of the Browser event.
	- `y` (number): The y coordinate on the page, usually the `pageY` property of the Browser event.
- `addProcess(name, args, position, namespace) -> object`: Adds a process block to the model builder.
	- `name` (string): The ID of the process to add.
	- `args` (object): The arguments for the process. The keys are the parameter names and the objects are the values for the corresponding parameter. Defaults to no arguments (empty object).
	- `position` (array|null): The position to show the newly created block. Use `getPositionForPageXY` to get the position from a Browser event. Set to `null` to place it automatically.
	- `namespace` (string|null): The namespace of the process to add, defaults to `null`.


### `ObjectTree`

Renders JavaScript objects in a more human-readable form.
Often used as a fallback if no other form of presentation is known by the client.

**Properties:**

- `data` (object): Any object (i.e. object, array or null)
- `collapseAfter` / `collapse-after` (integer|null): The number of elements to display for each object or array until a "show all" button is shown. Set to `null` to show all elements. Defaults to `10`.


### `Process`

Visualizes a single process following the openEO process description.

**Properties:**

- `process` (object, required): Process specification as defined by the openEO API (Either one of the array elements in the property `processes` returned by `GET /process` or the response from `GET /process_graphs/{process_graph_id}`).
- `provideDownload` / `provide-download` (boolean): Provide a link to download the JSON file (defaults to `true`).
- `processUrl` / `process-url` (string): See the corresponding prop in [`Description`](#description).
- `showGraph` / `show-graph` (boolean): Show and visualize the process graph (defaults to `false`).
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display the main heading.
- `before-description`: HTML to display before the description.
- `process-graph`: HTML to visualize the process graph.
- `end`: HTML to display after the component.

For all slots, the component properties are passed through as slot properties with the same names. In the slot `title`, you can additionally access `displayableNamespace`.

### `Processes`

Shows an (expandable) list of all processes available at a back-end.

**Properties:**

- `processes` (array, required): An array of processes as defined by the openEO API (`GET /processes` or `GET /process_graphs` although the latter is usually not complete).
- `provideDownload` / `provide-download` (boolean): See the corresponding prop in [`Process`](#process).
- `processUrl` / `process-url` (string): See the corresponding prop in [`Description`](#description).
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Processes`.
- `showGraph` / `show-graph` (boolean): See the corresponding prop in [`Process`](#process).
- `showCategories` / `show-categories` (boolean): Adds the categories to the third line of the summary if set to `true`. Defaults to `false`.
- `loadAdditionalData` / `load-additional-data` (function|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `missing` (array): The identifiers of the federated back-ends that are not providing data for the list of processes due to an issue.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `process-before-description`: See the corresponding slot `before-description` in [`Process`](#process).
- `process-end`: See the corresponding slot `end` in [`Process`](#process).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


### `SearchableList`

A template to implement searchable, sortable and collapsible lists (all optional).

**Properties:**

- `data` (array\<object>|object, required): The data to show in the list. Usually an array, but if an object is given the key of the elements is used as the default identifier. Each value of the array or object must be an object.
- `identifierKey` / `identifier-key` (string|null): The key in the object to use as identifiers (first line of the list). If not `null`, overrides the default identifier set from object keys. Defaults to `id`.
- `summaryKey` / `summary-key` (string|null): The key in the object to use as summary (second line of the list). If set to `null`, no summary is shown. Defaults to `summary`.
- `keywordsKey` / `keywords-key` (string|null): The key in the object to use as a list of keywords to display (third line of the list if `showKeywords` is set to `true`) and search through. Set to `null` to not consider keywords. Defaults to `null`.
- `showKeywords` / `show-keywords` (boolean): Adds the keywords referenced in `keywordsKey` to the third line of the list if set to `true`. Defaults to `false`.
- `externalSearchTerm` / `external-search-term` (string|null): Pass a string if a search term is injected from an external source and no search box should be shown. Setting to the empty string `""` effectively disables searching. Defaults to `null`, which will show a search box in the component itself so that users can filter the data by identifier and summary.
- `externalHideDeprecated` / `external-hide-deprecated` (boolean): Whether to hide deprecated items (`true`) or not (`false`).
- `deprecatedFilter` / `deprecated-filter` (boolean): Whether to show the deprecated filter checkbox (`true`) or not (`false`).
- `externalHideExperimental` / `external-hide-experimental` (boolean): Whether to hide experimental items (`true`) or not (`false`).
- `experimentalFilter` / `experimental-filter` (boolean): Whether to show the experimental filter checkbox (`true`) or not (`false`).
- `searchPlaceholder` / `search-placeholder` (string): A text to show as a placeholder in the search box. Defaults to `Search`.
- `sort` (boolean): Sort the data by identifier. Defaults to `true`.
- `offerDetails` / `offer-details` (boolean): If set to `false`, the data can't be expanded and no details will be shown. Defaults to `true`, which will show what has been defined in the `details` slot after a user has expanded the element.
- `collapsed` (boolean|null): If set to a boolean value, the component is collapsible. If it's set to `true` the component is collapsed and only the heading is shown initially. If set to `false` the component is expanded. Defaults to `null`, which expands the list and doesn't offer to collapse it.
- `showSummaryOnExpand` / `show-summary-on-expand` (boolean): If set to `false`, the summary gets hidden for expanded elements. Defaults to `true`.
- `allowCopy` (boolean): If set to `true`, shows a copy button for the identifier when the heading is hovered. May not work if the `summary` slot is used.
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `null`.
- `searchMinLength` / `search-min-length` (integer): The number of characters required to be given until the search starts. Defaults to `2` as it's usually not very meaningful to search for a single character.
- `loadAdditionalData` / `load-additional-data` (function|null): An asynchronous function that returns newly loaded data and replaces the original data in the viewer. The function has three parameters:
    - `key` (integer): Gives the index (for arrays) or the key (for objects) of the toggled element in the array or object given in the prop `data`.
    - `identifier` (number|string): Gives the identifier of the toggled element (corresponds to the values selected via the prop `identifierKey`).
	- `data` (object): The original data.

**Slots:**

- `heading`: HTML to display the heading, which by default consists of a title (see property `heading`) and the count of elements available in total. Will also show the count of elements matching the search term, if a search term has been given. The following slot properties are made available:
	- `filteredCount` (integer|null): The count of elements matching the search term. `null` if no filters are applied and all elements are shown.
	- `totalCount` (integer): The total count of elements.
- `content-start`: After heading, before searchbox and list.
- `after-search-box`:
	- `filteredCount` (integer|null): see above
	- `summaries` (array\<object>): The list of summaries.
- `summary`: HTML to display for the overview of the list element (includes identifier and summary). The following slot properties are made available:
	- `summary` (object): An object with some high-level information for the list element: `identifier`, `summary`, `show` and `index`. This is what you usually want to show here.
	- `item` (object): The original object from `data` for the list element.
- `details`: HTML to display for the details of the list element. This is what is shown after an element has been expanded. The following slot properties are made available:
	- `summary` (object): An object with saome high-level information for the list element: `identifier`, `summary`, `show` and `index`.
	- `item` (object): The original object from `data` for the list element. This is what you usually want to show here.

**Events:**

- `headingToggled(expanded)`: Emits if the component has been expanded or collapsed by the user via the heading.
    - `expanded` (boolean): Is `true` if the component is expanded, `false` otherwise.
- `detailsToggled(expanded, key, identifier, data)`: Emits if an element has been expanded or collapsed by the user.
    - `expanded` (boolean): Is `true` if the component is expanded, `false` otherwise.
    - `key` (integer): Gives the index (for arrays) or the key (for objects) of the toggled element in the array or object given in the prop `data`.
    - `identifier` (number|string): Gives the identifier of the toggled element (corresponds to the values selected via the prop `identifierKey`).
    - `data` (object): Gives the toggled element from the array or object given in the prop `data`. This is equal to accessing the array/object given in `data` with the `key` from above directly.
- `summaries(summaries)`: Emits if the summaries have changed.
	- `summaries` (array\<object>): The list of summaries.


### `SearchBox`

A simple input field for searching.

**Properties:**

- `value` / v-model (string, required): The search term given by the user.
- `placeholder` (string): A placeholder string to show in the input field if no search term has been typed in. Defaults to `Search`.
- `minLength` / `min-length` (number): Minimum length required for the search term. Defaults to `1`.
- `compact` (boolean): Renders the search box more compact if set to `true`. Defaults to `false`.

**Events:**

- `@input` / v-model: Fired when the value has changed.


### `Service`

Visualizes a single secondary web service.

**Properties:**

- `service` (object, required): Service details as defined by the openEO API (Either one of the array elements in the property `services` returned by `GET /services` or the response from `GET /services/{service_id}`).
- `currency` (string|null): The currency of the service (see openEO API endpoint `GET /`).
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display the main heading.
- `before-description`: HTML to display before the description.
- `process-graph`: See the corresponding slot `process-graph` in [`Process`](#process).
- `end`: HTML to display after the component.

For all slots, the component properties are passed through as slot properties with the same names.


### `ServiceType`

Visualizes a single secondary web service type supported by the back-end.

**Properties:**

The properties must be filled with parts of the response for supported secondary web services as defined by the openEO API (`GET /service_types`). Returned is an object like `{ WMS: {...}, WFS: {...} }` and one of the keys and values must be passed to the component.

- `id` (string, required): The identifier of the secondary web service (i.e. a key of the object; `WMS` or `WFS` in the example above)
- `service` (object, required): The secondary web service specification (i.e. the value for the corresponding key; `{...}` in the example above)
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display as the main heading.
- `before-description`: HTML to display before the description.
- `end`: HTML to display after the component.

For all slots, the component properties are passed through as slot properties with the same names.


### `ServiceTypes`

Visualizes all secondary web service types supported by the back-end.

**Properties:**

- `services` (object, required): Supported secondary web services as defined by the openEO API (`GET /service_types`).
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Secondary Web Services`.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `service-type-before-description`: See the corresponding slot `before-description` in [`ServiceType`](#servicetype).
- `service-type-end`: See the corresponding slot `end` in [`ServiceType`](#servicetype).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


### `SupportedFeatures`

Visualizes the supported functionalities of the back-end.

**Properties:**

- `endpoints` (array, required): Supported endpoints as defined by the openEO API (`GET /capabilities`, property `endpoints`).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `Supported Functionalities`.
- `headingTag` / `heading-tag` (string): HTML Tag to use for the heading. Defaults to `h2`.


### `Tabs` and `Tab`

Creates a tab interface. 

#### `Tabs`

**Properties:**

- `id` (string, required): A unique identifier for the tab container, preferrably only using `a`-`z` (upper- and lower-case), `0`-`9`, `-` and `_`.
- `pills` (boolean, default `false`): Switch between [normal boxed tabs and tabs with pills styling](https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp).
- `pillsMultiline` / `pills-multiline` (boolean, default `false`): If pills are active, the pills in the tabs header can be shown in multiple lines instead of squeezing all pills into a single line.
- `position` (string, default `top`): Position of the tabs/pills, either `top` or `bottom`.
- `allowTabRename` (boolean, default: `false`): Enables that dynamic tabs can be renamed by a user

**Methods:**

- `addTab(name, icon = null, data = null, id = null, selected = false, closable = false, show = null, hide = null, close = null, allowShow = null)`: Adds a new dynamic tab programatically, which is enabled by default.
	- `name` (string): The title of the tab.
	- `icon` (string): A [FontAwesome icon identifier](https://fontawesome.com/icons?d=gallery&s=solid&m=free), e.g. `fa-address-book`. This may require to load [FontAwesome](#fontawesome). Defaults to `null`, which shows no icon.
	- `data` (any): Additional data that is passed to the tab.
	- `id` (string|null): An id for the tab, preferrably only using `a`-`z` (upper- and lower-case), `0`-`9`, `-` and `_`. Specifying `null` generates an id.
	- `selected` (boolean): If set to `true`, the tab is getting selected and the active tab is set hidden.
	- `closable` (boolean): Set to `true` to show a close symbol, which can be used to close/remove the tab.
	- `show` (function): Function that is called when the tab is about to be shown. The tab is passed as a parameter to the function.
	- `hide` (function): Function that is called when the tab is about to be hidden. The tab is passed as a parameter to the function.
	- `close` (function): Function that is called when the tab is about to be closed. The tab is passed as a parameter to the function.
	- `allowShow` (function): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as a parameter.
- `getTab(id) -> object|null`: Get the Vue [`Tab`](#tab) instance by id. Returns `null` if not found.
- `getActiveTab() -> object`: Get the Vue [`Tab`](#tab) instance that is currently active. 
- `getActiveTabId() -> string`: Get the id of the tab that is currently active. 
- `async selectTab(tab)`: Set the currently active tab. `tab` can be either a Vue [`Tab`](#tab) instance or the id of a tab.
- `resetActiveTab(force = false)`: Selects the first tab if no tab is selected yet or `force` is set to `true`.
- `closeTab(tab)`: Removes the specified tab. `tab` can be either a Vue [`Tab`](#tab) instance or the id of a tab.

**Slots:**

- `default`: Place for [`Tab`](#tab) components to be added by default. Must only contain children of type [`Tab`](#tab) which contain the content for each of the tabs. The slot property `tabs` holds a reference to the `Tabs` component.
- `empty`: Content that is shown when no tab is available to be shown.
- `tabName`: A slot that can be used to customize the appearance of the tab name for each tab. The slot applies to *all* tabs. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.
- `dynamic`: Default content for dynamic tabs. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.
- The content for each dynamic tab that is added programmatically via the `addTab` method can also be filled with a slot that has the id of the tab (see example below). Otherwise the content of the `dynamic` slot is used. The slot property `tab` holds an object with the properties of the tab set with the `addTab` method.

**Events:**

- `@selected`: Fired when a Tab has been selected. The selected tab is passed as a parameter to the listener.
- `@empty`: Fired when no tab is available to be shown. The first parameter is `true` when no tab is available, otherwise `false`.

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
- `icon` (string, default `null`): A [FontAwesome icon identifier](https://fontawesome.com/icons?d=gallery&s=solid&m=free), e.g. `fa-address-book`. This may require to load [FontAwesome](#fontawesome). Defaults to `null`, which shows no icon.
- `selected` (boolean, default `false`): A single tab of a group should be selected by default by setting this property to `true`.
- `enabled` (boolean, default `true`): Set to `false` to hide the tab completely from the user.
- `closable` (boolean, default `false`): Set to `true` to show a close symbol, which can be used to close/remove the tab.
- `allowShow` / `allow-show` (function, default `null`): Asynchronous function that determines whether a tab can be shown. The function must `true` to allow switching the active tab. If `false` is returned, switching the tab is prevented. The tab to be shown is passed as a parameter.

**Slots:**

- `default`: Place for the content of your tab. The slot property `tab` holds a reference to this component.

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
- `federation` (object): The data of the `federation` property obtained from the capabilities.

**Slots:**

- `title`: HTML to display as the main heading.
- `badges`: HTML to display as the badges.
- `before-description`: HTML to display before the description.

For all slots, the component properties are passed through as slot properties with the same names.


### `UdfRuntimes`

Visualizes all UDF (user-defined function) runtimes supported by the back-end.

**Properties:**

- `runtimes` (object, required): Supported UDF runtimes as defined by the openEO API (`GET /udf_runtimes`).
- `searchTerm` / `search-term` (string|null): See the prop `externalSearchTerm` in [`SearchableList`](#searchablelist). 
- `sort` (boolean): See the corresponding prop in [`SearchableList`](#searchablelist). 
- `offerDetails` / `offer-details` (string): See the corresponding prop in [`SearchableList`](#searchablelist).
- `collapsed` (boolean|null): See the corresponding prop in [`SearchableList`](#searchablelist).
- `heading` (string|null): Specifies the title of the component. If set to `null`, the title is hidden. Defaults to `UDF Runtimes`.
- `federation` (object): The data of the `federation` property obtained from the capabilities.
- `hideDeprecated` / `hide-deprecated` (boolean): See the prop `externalHideDeprecated` in [`SearchableList`](#searchablelist).
- `deprecatedFilter` / `deprecated-filter` (boolean): See the prop `deprecatedFilter` in [`SearchableList`](#searchablelist).
- `hideExperimental` / `hide-experimental` (boolean): See the prop `externalHideExperimental` in [`SearchableList`](#searchablelist).
- `experimentalFilter` / `experimental-filter` (boolean): See the prop `experimentalFilter` in [`SearchableList`](#searchablelist).

**Slots:**

- `heading`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `summary`: See the corresponding slot in [`SearchableList`](#searchablelist).
- `udf-runtime-badges`: See the corresponding slot `badges` in [`UdfRuntime`](#udfruntime).
- `udf-runtime-before-description`: See the corresponding slot `before-description` in [`UdfRuntime`](#udfruntime).

**Events:**

- `headingToggled(expanded)`: See the corresponding event in [`SearchableList`](#searchablelist).
- `detailsToggled(expanded, key, identifier, data)`: See the corresponding event in [`SearchableList`](#searchablelist).


## Other features

*Attention: The following features may get (partially) moved to `@openeo/js-commons` in one of the next beta releases. The documentation may be incomplete, too.*

### `FeatureList`

A list of categorized features with their corresponding endpoints as used by the components [`SupportedFeatures`](#supportedfeatures).

### `Utils`

* `compareStringCaseInsensitive(string a, string b) -> integer`: Compares both strings (a) case-insensitive and (b) in natural order. Returns `-1` if `a` is sorted before `b`, `0` if they are equal and `1` otherwise.
* `friendlyLinks(array linkList, boolean sort = true, array ignoreRel = ['self']) -> array`: Accepts an array of links as defined by the openEO API and pre-processes it for better handling in templates. It tries to generate a meaningful title, if not available. It optionally also sorts the links by title and removes links with the given relation types in `ignoreRel`.
* `htmlentities(string str) -> string`: Replace `"`, `'`, `<` and `>` characters in strings with HTML entities.
* `htmlentities_decode(string str) -> string`: Replace the HTML entities for `"`, `'`, `<` and `>` with their respective characters.
* `prettifyAbbreviation(string str) -> string`: Converts a string to uppercase if all letters given are lower-cased.
* `prettifyString(string str) -> string`: Tries to convert strings in snake-case, camel-case or kebab-case into more human-readable texts, mostly by adding spaces.
* `search(string searchterm, array|string|object values, boolean and = true)`: Searches for search term(s) in various inputs. Splits the `searchterm` at certain word boundaries (e.g. whitespaces and punctuation). Does 'and' search by default. Can be switched to 'or' by setting `and` to `false`. `values` can be an array of strings, a string or an object of strings (searches the values only).
* `isUrl(string url, boolean httpOnly = true)`: Checks a absolute URL for validity. Only allows http and https if `httpOnly` is set to `true`.
* and other functions not meant for public use.
