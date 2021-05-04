# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New `Job` component
- New `JobEstimate` component
- New `Service` component
- `Tabs`:
  - Event `selected`
  - Prop `pillsMultiline` to show pills in multiple rows
- Job Status is now shown in different colors
- `Process`: Add option and slot to visualize process graph for processes

### Changed

- `UdfRuntime`: Full support for `experimental` and `deprecated` flags
- `ObjectTree`: Visualize boolean values with symbols instead of text
- `Item` and `Collection`: Better visualization for openEO processes

### Fixed

* `Collections`: Don't pass `mapOptions` to `SearchableList`
* `Process`: Show better text if return value has not been declared

## [2.0.3] - 2020-03-15

### Changed

- Don't show margin for `pre` tag in Items and Collections.
- Better format spatial reference systems for data cubes.

### Fixed

- Fix version check issue when Leaflet should be replaced by another mapping library.

## [2.0.2] - 2020-03-12

### Changed

- Conflicts with other Leaflet instances (e.g. from ipyleaflet) are mitigated

### Fixed

- Item and Collection metadata must be migrated with stac-migrate before passing the data to stac-fields
- Fix some prop-related issues such as typos in the prop name
- In some cases Web Components were not able to load the data passed via script tags
- Event `summaries` was not emitted for all changes

## [2.0.1] - 2020-03-08

### Fixed

- Fixed a rare issue in some environments (e.g. Jupyter Notebooks) in which the HTML props were not taken into account on subsequent calls. The type attribute for the slots is `true/application/json` for an unknown reason.

## [2.0.0] - 2020-03-04

### Added
- `Collection`: Allow to pass `mapOptions` through to `Collection` component
- `Items` component
- `SearchableList`: Slot `after-search-box` and event `summaries`

### Removed
- `DataTable`: Slot `footer`

### Fixed
- Fixed `DataTable` CSS
- Updated dependencies

## [2.0.0-rc.5] - 2020-02-26

### Added
- `DataTable` component
- `SearchBox`: Property `compact` added

### Changed
- Upgraded to stac-fields v1.0.0-beta.3

### Fixed
- Label formatting in Collections
- Scroll to bands in Collections
- Previews in Items and Collections are shown correctly

## [2.0.0-rc.4] - 2020-02-18

### Added
- Add component `Item` to render Batch Job Results and STAC Items

### Changed
- `Collection`: Property `collection` has been renamed to `data`

### Fixed
- Web Components: With slow connections sometimes the data passed in `script` tags was not available (re-implementation of `Utils.enableHtmlProps`)
- Web Components: Fixed README with regards to how the props must be used (kebab-case instead of camelCase)
- Initial state for Tab(s) and JsonSchema components is correctly registered

## [2.0.0-rc.3] - 2020-02-10

### Changed
- Migrated from custom StacUtils to new package `@radiantearth/stac-fields` to format Collection metadata

### Fixed
- Leaflet CSS import issue

## [2.0.0-rc.2] - 2020-01-29

### Added
- `SearchableList`: The item keys `experimental` and `deprecated` lead to a different rendering.
- `Collection`: Slot property `mapOptions` added.
- `Collection`, `FileFormat`, `Process`, `ServiceType` and `UdfRuntime`: Slots pass through all the props from the component (except `spatial-extents` and `temporal-extents` in `Collection`).
- `Collections`, `FileFormats`, `Processes`, `SearchableList`, `ServiceTypes` and `UdfRuntimes`:
    - Events `headingToggled` and `detailsToggled` have been introduced
	- Slot properties are passed through for slots that are made available in the sub-components (e.g. `Collection`)

### Changed
- Some components show loading and error details for sub-components instead of "No data available".

### Fixed
- `Collection`: Map is rendered correctly in Jupyter Environments
- `Process`: Fixed 'Download JSON' button
- `SearchableList`:
    - Do initial search if `externalSearchTerm` is given
    - Correctly call expand/collapse function for heading
- `Utils.htmlentities` and `Utils.htmlentities_decode`: Always return a string
- Web Component examples can also be created with `npm run wc-examples`


## [2.0.0-rc.1] - 2020-01-22

### Added
- `SearchBox` component
- `Collections`, `FileFormats`, `Processes`, `SearchableList`, `ServiceTypes` and `UdfRuntimes`: Property `collapsed` has been introduced
- `Collections`: Added slots `collection-before-description`, `collection-end`, `collection-spatial-extents`, `collection-temporal-extents` and `summary`
- `FileFormats`: Added slots `file-format-before-description`, `file-format-end` and `summary`
- `Processes`: Added slots `process-before-description`, `process-end` and `summary`
- `ServiceTypes`: Added slots `service-type-before-description`, `service-type-end` and `summary`
- `UdfRuntimes`: Added slots `udf-runtime-badges`, `udf-runtime-before-description` and `summary`

### Changed
- `Collections`, `FileFormats`, `Processes`, `SearchableList`, `ServiceTypes` and `UdfRuntimes`: Property `allowExpand` has been renamed to `offerDetails`
- Made it easier to override CSS rules by avoiding scoped CSS

### Fixed
- Slot detection


## [2.0.0-beta.2] - 2020-01-21

### Fixed
- `JsonSchema` and `ObjectTree` show all details when used as Web Component [vue-cli#6225](https://github.com/vuejs/vue-cli/issues/6225)


## [2.0.0-beta.1] - 2020-01-20

This release contains a large number of changes. It lists only the major changes that may need users to adapt their code. Bug fixes or minor improvements are not listed in detail.

### Added
- New components:
	- `Collections`
	- `FileFormat`
	- `Processes`
	- `SearchableList`
	- `ServiceType`
- `BillingPlans`: 
	- New properties `heading` and `headingTag`
	- Shows a heading by default
- `Description`: New property `allowHTML` to enable HTML rendering embedded in Markdown files
- `FileFormats`, `ServiceTypes` and `UdfRuntimes`:
	- New properties `searchTerm`, `sort`, `allowExpand`, `heading`
	- Shows a heading by default
	- Supports searching by default and shows a search box
	- Expands on click to show details about the file format / service type / UDF runtime
- `ObjectTree`: New property `collapseAfter` to set the number of array elements or object properties to show by default. This can now be used to show all, too.
- `SupportedFeatures`: 
	- New properties `heading` and `headingTag`
	- Shows a heading by default
- `UdfRuntime`: Added slots `title`, `badges` and `before-description`
- `Collections`, `FileFormats`, `Processes`, `ServiceTypes`, `UdfRuntimes`: Added slot `heading` (passes through to `SearchableList`)

### Changed
- Release components as [Async Web Components](https://cli.vuejs.org/guide/build-targets.html#async-web-component) instead of as Vue Library. [#28](https://github.com/Open-EO/openeo-vue-components/issues/28)
	- In a Vue environment the components need to be imported directly from the `components` folder.
	- In an HTML environment the components can be included as HTML tag instead of initializing it as a Vue app.
- `Capabilities`: Removed properties `serviceTypes`, `fileFormats` and `udfRuntimes`. These are not rendered any longer in the component and the corresponding components need to be rendered manually.
- `Collection`:
	- Property renamed from `collectionData` to `collection`.
	- Property `mapOptions.scrollWheelZoom` defaults to `false` instead of `true`.
	- Leaflet and related dependencies don't need to be included explicitly in the HTML files.
	- All slots have changed.
- `DeprecationNotice` and `ExperimentalNotice`: The texts have slightly changed so that the property `entity` is not required any longer.
- `FileFormats`: Properties `showInput` and `showOutput` have the default value `true`. Beforehand it was `false`.
- `ObjectTree`: The default number of array elements or object properties to show has been reduced from 50 to 10.
- `Process`: 
	- Property renamed from `processData` to `process`.
	- All slots have changed.
- `UdfRuntime`:
	- Properties have been renamed. `runtimeId` to `id`, `runtimeData` to `runtime` and `runtimeVersion` to `version`

### Removed
- Components don't migrate old API responses automatically any longer, which leads to the following changes:
	- Dropped support for API version 0.4.
	- The `version` property that specifies the version number of the given API response has been removed for all components.
	- The `BaseMixin` is not required any longer.
- The single entity components can't collapse any longer. The property `initiallyCollapsed` has been removed for all components.
- `BillingPlans`: Removed method `getPlanCount()`.
- `EventBusMixin`. Use Vue's native `$on` and `$off` methods on the `$root` component instead.
- `FileFormats`, `LinkList`, `ServiceTypes`, `UdfRuntimes`: Removed method `getCount()`. Counts will be shown directly in the lists.
- `SupportedFeatures`: Removed methods `getFeatures`, `getFeatureCount`, `getSupportedFeatureCount`. Counts will be shown directly in the list and features can be imported from the `featurelist.js`.

### Fixed
- Several minor improvements and bugfixes to the components overall.
- Better documentation


## [1.0.0] - 2020-12-18

First stable release.

## Legacy

Please see the [Releases](https://github.com/Open-EO/openeo-vue-components/releases) for changelogs prior to v1.0.0.


[Unreleased]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.3...HEAD
[2.0.3]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-rc.5...v2.0.0
[2.0.0-rc.5]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-rc.4...v2.0.0-rc.5
[2.0.0-rc.4]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-rc.3...v2.0.0-rc.4
[2.0.0-rc.3]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-rc.2...v2.0.0-rc.3
[2.0.0-rc.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-rc.1...v2.0.0-rc.2
[2.0.0-rc.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-beta.2...v2.0.0-rc.1
[2.0.0-beta.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-beta.1...v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/Open-EO/openeo-vue-components/compare/v1.0.0...v2.0.0-beta.1
[1.0.0]: https://github.com/Open-EO/openeo-vue-components/releases/tag/v1.0.0
