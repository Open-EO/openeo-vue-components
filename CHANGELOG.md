# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `Collections`, `FileFormats`, `Processes`, `SearchableList`, `ServiceTypes` and `UdfRuntimes`: Property `collapse` has been introduced

### Changed
- `Collections`, `FileFormats`, `Processes`, `SearchableList`, `ServiceTypes` and `UdfRuntimes`: Property `allowExpand` has been renamed to `offerDetails`


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


[Unreleased]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-beta.2...HEAD
[2.0.0-beta.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-beta.1...v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/Open-EO/openeo-vue-components/compare/v1.0.0...v2.0.0-beta.1
[1.0.0]: https://github.com/Open-EO/openeo-vue-components/releases/tag/v1.0.0
