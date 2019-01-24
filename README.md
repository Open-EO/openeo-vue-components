# openeo-vue-components
A set of [Vue](https://vuejs.org) components for [openEO](http://openeo.org).

## Components

### `BillingPlans`
Visualizes the billing information of the back-end.

**Properties:**
* `version` (string): openEO version
* `billing` (object): Billing information as defined by the openEO API.

### `Capabilities`
Visualizes all the server information of the back-end. Shows the title, description, back-end version, `SupportedFeatures` and `BillingPlans`.

**Properties:**
* `capabilities` (object): Capabilities response as defined by the openEO API.

### `Collection`
Visualizes a collection following the STAC-based collection description.

**Properties:**

* `collection` (object): A single STAC-based collection object as defined by the openEO API.

### `Description`
A simple text renderer, which supports CommonMark.

**Properties:**
* `description` (string): The text to show.

### `LinkList`
A simple list of links.

**Properties:**

* `links` (array\<object>): An array of objects, each describing a link as defined by the openEO API.

### `Process`
Visualizes a process following the openEO process description in the latest version. Legacy specifications need to run `Utils.convertProcessToLatestSpec()` beforehand.

**Properties:**

- `process` (object): Process specification as defined by the openEO API.
- `provideDownload` (boolean): Provide a link to download the JSON file (defaults to `true`).
- `initiallyCollapsed` (boolean): Allow collapsing/expanding the details and collapse the details by default (defaults to `false`).

**Slots:**

- `process-before-summary`
- `process-after-summary`
- `process-before-details`
- `process-after-details`

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

### `SupportedFeatures`
Visualizes the supported functionalities of the back-end.

**Properties:**

- `version` (string): openEO version
- `endpoints` (object): Supported endpoints as defined by the openEO API.

## Utils
Some utility methods used by the components, which could also be useful for other purposes:

* ToDo