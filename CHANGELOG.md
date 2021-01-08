# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0-beta.1] - 2020-01-31

### Added

### Changed
- Release components as [Async Web Components](https://cli.vuejs.org/guide/build-targets.html#async-web-component) instead of as Vue Library. [#28](https://github.com/Open-EO/openeo-vue-components/issues/28)
- `Collection`: Prop renamed from `collectionData` to `collection`
- `Process`: Prop renamed from `processData` to `process`

### Deprecated

### Removed
- `EventBusMixin`, use Vue's native `$on` and `$off` methods on the `$root` component instead.
- `BaseMixin`, not required any longer.
- `getCount()` methods from `FileFormats`, `LinkList`, `ServiceTypes`, `UdfRuntimes`. Counts will be shown directly in the lists.
- `getPlanCount()` method from `BillingPlans`.

## [1.0.0] - 2017-06-20

First stable release.

## Legacy

Please see the [Releases](https://github.com/Open-EO/openeo-vue-components/releases) for changelogs prior to v1.0.0.


[Unreleased]: https://github.com/Open-EO/openeo-vue-components/compare/v2.0.0-beta.1...HEAD
[2.0.0-beta.1]: https://github.com/Open-EO/openeo-vue-components/compare/v1.0.0...v2.0.0-beta.1
[1.0.0]: https://github.com/Open-EO/openeo-vue-components/releases/tag/v1.0.0
