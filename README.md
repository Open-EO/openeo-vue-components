# openeo-vue-components

A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

This library's version is **0.3.6** and supports **openEO API versions 0.3.x and 0.4.x**. Legacy versions are available as releases.

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
- `collection-spatial-extent` (passes the extent as array, e.g. to insert a map.)
- `collection-temporal-extent` (passes the extent as array)

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