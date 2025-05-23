# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.20.0] - 2025-05-13

### Added

- `DataTable` and `Logs`: Add federation support (new props `federation` and `missing`)
- `Service`: Add federation support (new prop `federation`)
- `UdfRuntime`: Add federation support per runtime version

## [2.19.0] - 2025-04-25

### Added

- `FederationMissingNotice`: Prop `compact`

## [2.18.3] - 2025-01-15

### Fixed

- `BButton`:
  - Update buttons when the title changes
  - Don't show tooltip when empty
  - Fixed positioning

## [2.18.2] - 2025-01-15

### Added

- Internal `BButton` component as base for `AsyncButton`

## [2.18.1] - 2025-01-05

### Added

- `Collections` and `Items`: Add slots `content-start` and `after-search-box`

## [2.18.0] - 2025-01-04

### Added

- `DataTable`: Props `next` and `fa`

## [2.17.0] - 2024-08-12

### Added

- Support for STAC 1.1

### Fixed

- Upgraded dependencies to solve various issues (e.g. datacube subtype support)

## [2.16.0] - 2024-07-26

### Added

- `Tabs`: Support to rename dynamic tab titles (enable via prop `allowTabRename`)
- `Collections`, `FileFormats`, `Items`, `Processes`, `ServiceTypes` and `UdfRuntimes`: New props `hideDeprecated` and `deprecatedFilter`
- `SearchableList`: New props `externalHideDeprecated` and `deprecatedFilter`
- Upgraded stac-fields

## [2.15.1] - 2024-05-22

### Changed

- Prop `hideDeprecatedByDefault` split into to `hideDeprecated` and `deprecatedFilter` (all except `SearchableList`)
- Prop `hideDeprecatedByDefault` split into to `externalHideDeprecated` and `deprecatedFilter` (only `SearchableList`)
- Deprecated filter must be enabled explicitly

## [2.15.0] - 2024-05-22

### Added

- Option to hide deprecated elements from lists by default (prop: `hideDeprecatedByDefault`)
- Copy Asset URL

### Fixed

- `Logs`:
  - Fix description of field selector
  - Improved look of field badges
  - Make sure internal state doesn't conflict
  - Use better delete symbol
- Complex tabular STAC data gets rendered correctly

## [2.14.1] - 2023-05-08

### Fixed

- Clarify `budget` field in batch jobs and services

## [2.14.0] - 2023-01-26

### Added

- `ModelBuilder`:
  - Duplicate single blocks via button
  - Copy&Paste multiple blocks (without edges)

## [2.13.0] - 2022-12-08

### Added

- `ModelBuilder`: The `showParameter` event has a new `origin` parameter

### Fixed

- `ModelBuilder`: Don't show the edit button for non-user parameters

## [2.12.0] - 2022-11-30

### Added

- `Job`: Added support for showing links and min. log level.

### Fixed

- `Logs`: Use log id for Vue's `key` property
- `ModelBuilder`: Explicitly set the text color for blocks to help with dark modes.

## [2.11.0] - 2022-10-27

### Added

- `Logs`: The fields to search in can be selected.
- `ModelBuilder`: Allow to set the `height` of the component.

### Changed

- `Logs`: More data types can be searched in
- `SearchBox`: Improved styling for the search box.

### Fixed

- `ModelBuilder`: Unsaved changes to a description get saved when changing zoom

## [2.10.3] - 2022-10-10

### Fixed

- Better error messages for copy&paste
- Close callbacks get fired for tabs

## [2.10.2] - 2022-08-29

### Fixed

- Add Chrome > 69 in browserlist to support at least RStudio IDE > 2022.02.2
- `JsonSchema`: Use replace instead of replaceAll for better compatibility

## [2.10.1] - 2022-07-28

### Changed

- `DataTable`: Add `thead` and `tbody`

### Fixed

- Use locale settings for file size and restrict fraction digits to 2 for non-currencies

## [2.10.0] - 2022-07-18

### Changed

- Upgraded to Vue 2.7 (and vue-cli 5)

### Fixed

- Fix mixin usage in FederationMissingNotice in web component mode
- Fixed usage of `event.target` in Web Component mode

## [2.9.2] - 2022-07-18

### Fixed

- `Process`: Make component SRR friendly

## [2.9.1] - 2022-07-18

### Added

- `Process`: The variable `displayableNamespace` is passed to the `title` slot

## [2.9.0] - 2022-07-18

### Added

- `SearchableList`: Allow showing a copy symbol for the identifier (enabled for collections and processes)

### Changed

- `Collection`: Show more top-level metadata fields

### Fixed

- `Process`:
  - Escape non-printable characters (`\r`, `\n`, `\t`) in regular expressions properly 
  - Show a constant boolean value as boolean value instead of yes/no
- Small improvements to separate blocks better in `JsonSchema`, `Process` and `Logs`

## [2.8.1] - 2022-05-23

### Added

- `Utils.isUrl()`

### Changed

- `ModelBuilder`: Create more human-friendly node names

### Fixed 

- `ModelBuilder`:
  - Descriptions for blocks not shown initially
  - If process namespace is a URL, don't show process as missing

## [2.8.0] - 2022-04-14

### Added

- Support for the experimental Federation Extension
- New component `FederationMissingNotice`
- `Tabs`: New slot and event with name `empty`

### Changed

- Make assets more compact

### Fixed

- `ModelBuilder`:
  - Minor speed improvements
  - Don't add default values to exported process arguments
- `SearchBox`: Fixed wrongly computed width

## [2.7.1] - 2022-01-25

### Fixed

- `UdfRuntime`: When no data is available yet, the component failed to render something at all.

## [2.7.0] - 2021-12-15

### Added

- `Collection`, `Collections`, `Item`, `Items`: Added `attribution` and `basemap` options to `mapOptions` to make basemap tile layer configurable.
- `Utils`: New function `search` to do advanced search in texts.
- `Logs`: Support for searching through logs, also adds new prop `externalSearchTerm`.

### Changed

- `DataTable` and `SearchableList` (and all usages of it): Use `Utils.search` instead of the previous simple search method.
- `UdfRuntime`: Each version tab has a CSS class assigned; built from the runtime identifier and the version number.
- `Tab`: Each tab/pill gets the tab id a CSS class name assigned.

### Fixed

- Fixed typos in `DeprecationNotice` (classes and component name)

## [2.6.2] - 2021-11-03

### Fixed

- `JsonSchema`: Improved rendering for properties.
- `ModelBuilder`:
  - HTML code for parameters contains invalid attributes.
  - Improved UX for blocks (context-sensitive cursors etc.)
- Rendering of data types has been improved
- Process return values consisting of multiple data types don't always return `any`
- Don't include Leaflet multiple times (bundles got larger starting with v2.6.0)

## [2.6.1] - 2021-09-07

### Fixed 

- `ModelBuilder`: Deleting parameters with connected edges didn't work.

## [2.6.0] - 2021-09-01

### Added

- `Collection` / `Item`: Show more details for STAC assets

### Fixed

- Upgraded dependencies, which includes several updates and bug fixes
- `Collection` / `Item`: Correctly migrate all STAC data

## [2.5.1] - 2021-08-19

### Fixed

- `ModelBuilder`:  Incorrectly sent an update event when adding (importing) process parameters, which resulted in empty processes

## [2.5.0] - 2021-08-18

### Added

- `Collection`: Pass `worldwide` property to `spatial-extents` slot.
- `ModelBuilder`:
  - Experimental namespace support
    - `showProcess` event is also passing the process namespace as second parameter.
    - `addProcess` has a new fourth parameter `namespace`.
  - New property `explicitZoom` to zoom only when in focus or when the STRG / Meta key is pressed.

### Changed

- Updated dependencies (use `ProcessRegistry` from js-commons instead of js-processgraphs)

### Fixed

- `SearchableList`:  Minor CSS fix for badges
- Minor CSS fixes for overly long content, especially in Collections

## [2.4.1] - 2021-08-03

### Added

- `ModelBuilder`: Basic support for copy&paste of processes (JSON)

### Fixed

- `Collection`:
  - Only show providers heading if there are providers available.
  - Minor style improvements
- `ModelBuilder`: Properly unset default values when editing parameters

## [2.4.0] - 2021-08-02

### Added
- `SearchableList`:
  - New prop `keywordsTag`: Support to search in a list of keywords additionally
  - New prop `showKeywords`: Option to show keywords below the summary (already in the collapsed view)
- `Collections`:
  - Searches in keywords, too
  - New prop `showKeywords`: Option to show keywords below the summary (already in the collapsed view)
- `Processes`:
  - Searches in categories, too
  - New prop `showCategories`: Option to show categories below the summary (already in the collapsed view)
- `FileFormats`:
  - Searches in `gis_raster_type`, too
- `ModelBuilder`:
  - Visualize parameters used in child processes (if process schemas are available)
  - Added event `editParameter`

### Changed

- `Collection`:
  - Make the component more compact / consume less space
  - Move keywords up (before: below collection, now: below summary)
  - Use Badges instead of comma separated values to better stand out
  - Shows "Worldwide" instead of a map if the spatial extent covers the whole Earth
- `Collection` / `Item`: Changed default height from 300 to 250px
- `ModelBuilder`:
  - Show default values for parameters
  - Event `editParameters` has been renamed to `editArguments`
  - Method `addPgParameter` is now async.
  - Major code refactoring
- `Process`: Changed place of categories and "Download JSON" with summary

### Fixed

- `FileFormats`: File formats get sorted correctly
- `Collection`: Support multiple extents better
- `ModelBuilder`:
  - Change blocks in ModelBuilder not directly, but instead emit events properly in Block component
  - Several minor bug fixes
- Minor improvements to CSS

## [2.3.4] - 2021-07-16

### Changed

- `ModelBuilder`:
  - Event `showSchema` was renamed to `showParameter` with a new set of parameters.
  - Edges from incompatible inputs/outputs are created in red with an error message instead of completely rejecting the edge. Thus, the import is also not interrupted for such issues.

### Fixed

- `JsonSchema`: Don't show properties with undefined values any longer.

## [2.3.3] - 2021-07-15

### Fixed

- `ModelBuilder`: Fix issue that prevented deleting certain blocks
- SCSS dependencies are now installed as normal dependencies instead of devDependencies

## [2.3.2] - 2021-07-14

### Changed

- Usage metrics numbers are better formatted (decimal and thousands separators).
- Don't set fallback size for `ModelBuilder` any longer.

### Fixed

- Fix CSS issue in `ModelBuilder`: Result node output was not correctly rendered.
- Fix CSS issue in `Tabs`: Boxed Tabs were somtimes a bit too small or large.
- Fix CSS issue in `Logs`: Expand/Collapse arrow changes again based on state.
- `Process`: Fallback to `unnamed` if no process id is present (to avoid issues with the `ModelBuilder` for example).
- `ModelBuilder`: Fix issue when parameter name and node id conflict.

## [2.3.1] - 2021-07-09

### Fixed

- The fallback size set in `ModelBuilder` was too intrusive and couldn't be altered from externally.

## [2.3.0] - 2021-07-09

### Added

- `ModelBuilder` component to nicely visualize process graphs (migrated over from Web Editor)
- `Processes`: Make `showGraph` prop from `Process` component  available
- `Collections`, `Items`, `Processes`, `SearchableList`: Add new property `loadAdditionalData` to load additional data in expanded state.

### Changed

- `Logs`: Don't allow passing `null` (to show a loading state) any longer, which was an undocumented left-over from the Web Editor.
- `Process`: Use `ModelBuilder` instead of `ObjectTree` to visualize the processing instructions.
- `Tab` / `Tabs`: Load FontAwesome automatically if not available (Vue environments only).
- CSS styles are processed with SCSS and thus `base.css` has been renamed to `base.scss`
- `SearchableList`: `detailsToggled` is not emitted to parent any longer, the parent components do this now directly.

### Fixed

- FontAwesome support in Web Components improved
- Better instructions on FontAwesome usage in Web Components
- Base CSS was missing from some components
- Added missing `vue-component` class that was missing from some components
- Updates dependencies

## [2.2.2] - 2021-07-01

### Added

- `Job` and `Service`: supports usage metrics

### Fixed

- Fixed an error that was thrown in the case that no time is present in the logs

## [2.2.1] - 2021-06-24

### Fixed

- `Process`: *'The return value has not been defined.'* was shown for processes that had no parameters regardless of the actual return value.

## [2.2.0] - 2021-06-17

### Added

- `Logs`: supports time and usage metrics

### Changed

- `Logs`:
  - New style
  - Show more details for stack trace / path

### Fixed

- `Logs`: Correctly distinguish "non-existing" and "null" for `data`

## [2.1.2] - 2021-06-14

### Fixed

- `Collection` and `JobEstimate`: Don't throw an exception when a duration or temporal step is invalid.
- `Collection`: Prevent map from incorrectly relocating to the preview section when data is altered externally.
- Better keys in Vue loops.

## [2.1.1] - 2021-05-31

### Changed

- `ObjectTree`: Don't spit out functions and symbols, use a placeholder instead.
- `detailsToggled` event clarified behavior of the parameters and passes more parameters.
- `SearchableList` regenerates summaries only if the object is actually a different one (in memory), not just the same with modified content.

### Fixed

- `Collection`:
  - Correctly render steps in temporal dimensions
  - Correctly render (empty) temporal extents
  - Fix error when no summaries were present in the Collection
- `Collection` and `Item`: Improve consistency of how units get shown

## [2.1.0] - 2021-05-05

### Added

- New `Job` component
- New `JobEstimate` component
- New `Logs` component
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
- `Process`: Show default values in process signature

### Fixed

- `Collections`: Don't pass `mapOptions` to `SearchableList`
- `Process`:
  - Show better text if return value has not been declared
  - Fix spacing around process signature

## [2.0.3] - 2021-03-15

### Changed

- Don't show margin for `pre` tag in Items and Collections.
- Better format spatial reference systems for data cubes.

### Fixed

- Fix version check issue when Leaflet should be replaced by another mapping library.

## [2.0.2] - 2021-03-12

### Changed

- Conflicts with other Leaflet instances (e.g. from ipyleaflet) are mitigated

### Fixed

- Item and Collection metadata must be migrated with stac-migrate before passing the data to stac-fields
- Fix some prop-related issues such as typos in the prop name
- In some cases Web Components were not able to load the data passed via script tags
- Event `summaries` was not emitted for all changes

## [2.0.1] - 2021-03-08

### Fixed

- Fixed a rare issue in some environments (e.g. Jupyter Notebooks) in which the HTML props were not taken into account on subsequent calls. The type attribute for the slots is `true/application/json` for an unknown reason.

## [2.0.0] - 2021-03-04

### Added
- `Collection`: Allow to pass `mapOptions` through to `Collection` component
- `Items` component
- `SearchableList`: Slot `after-search-box` and event `summaries`

### Removed
- `DataTable`: Slot `footer`

### Fixed
- Fixed `DataTable` CSS
- Updated dependencies

## [2.0.0-rc.5] - 2021-02-26

### Added
- `DataTable` component
- `SearchBox`: Property `compact` added

### Changed
- Upgraded to stac-fields v1.0.0-beta.3

### Fixed
- Label formatting in Collections
- Scroll to bands in Collections
- Previews in Items and Collections are shown correctly

## [2.0.0-rc.4] - 2021-02-18

### Added
- Add component `Item` to render Batch Job Results and STAC Items

### Changed
- `Collection`: Property `collection` has been renamed to `data`

### Fixed
- Web Components: With slow connections sometimes the data passed in `script` tags was not available (re-implementation of `Utils.enableHtmlProps`)
- Web Components: Fixed README with regards to how the props must be used (kebab-case instead of camelCase)
- Initial state for Tab(s) and JsonSchema components is correctly registered

## [2.0.0-rc.3] - 2021-02-10

### Changed
- Migrated from custom StacUtils to new package `@radiantearth/stac-fields` to format Collection metadata

### Fixed
- Leaflet CSS import issue

## [2.0.0-rc.2] - 2021-01-29

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


## [2.0.0-rc.1] - 2021-01-22

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


## [2.0.0-beta.2] - 2021-01-21

### Fixed
- `JsonSchema` and `ObjectTree` show all details when used as Web Component [vue-cli#6225](https://github.com/vuejs/vue-cli/issues/6225)


## [2.0.0-beta.1] - 2021-01-20

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


[Unreleased]: https://github.com/Open-EO/openeo-vue-components/compare/v2.20.0...HEAD
[2.20.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.19.0...v2.20.0
[2.19.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.18.3...v2.19.0
[2.18.3]: https://github.com/Open-EO/openeo-vue-components/compare/v2.18.2...v2.18.3
[2.18.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.18.1...v2.18.2
[2.18.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.18.0...v2.18.1
[2.18.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.17.1...v2.18.0
[2.17.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.16.0...v2.17.0
[2.16.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.15.1...v2.16.0
[2.15.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.15.0...v2.15.1
[2.15.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.14.1...v2.15.0
[2.14.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.14.0...v2.14.1
[2.14.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.13.0...v2.14.0
[2.13.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.12.0...v2.13.0
[2.12.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.11.0...v2.12.0
[2.11.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.10.3...v2.11.0
[2.10.3]: https://github.com/Open-EO/openeo-vue-components/compare/v2.10.2...v2.10.3
[2.10.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.10.1...v2.10.2
[2.10.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.9.2...v2.10.0
[2.9.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.9.1...v2.9.2
[2.9.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.8.1...v2.9.0
[2.8.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.7.1...v2.8.0
[2.7.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.6.2...v2.7.0
[2.6.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.4.1...v2.5.0
[2.4.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.3.4...v2.4.0
[2.3.4]: https://github.com/Open-EO/openeo-vue-components/compare/v2.3.3...v2.3.4
[2.3.3]: https://github.com/Open-EO/openeo-vue-components/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.2.2...v2.3.0
[2.2.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.1.2...v2.2.0
[2.1.2]: https://github.com/Open-EO/openeo-vue-components/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/Open-EO/openeo-vue-components/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.3...v2.1.0
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