## Changelog / 变更日志

### 2025-08-10

-   Added

    -   Central typings entry `types/index.d.ts` and regenerated declaration files under `types/generated/` for core and plugins (dom, format, graph, layout_provider, mind, node, option, plugin, shortcut_provider, util, view_provider, draggable-node, screenshot).
    -   Declaration build config `tsconfig.decls.json` and npm scripts: `gen:dts`, `gen:dts:check`.
    -   TypeScript typings validation: `tests/unit/typescript.types.test.js` with fixture `tests/fixtures/typescript-test.ts` using TypeScript Compiler API.

-   Changed

    -   Updated `package.json` to expose `types` via `types/index.d.ts` and added scripts for generating/checking declarations.
    -   Enriched JSDoc and in-source documentation across core modules and plugins to improve generated typings (data_provider, dom, format, graph, layout_provider, mind, node, option, plugin, util, view_provider, draggable-node, screenshot).
    -   Updated `tsconfig.json` strictness and paths; CI updated to run `npm run gen:dts` before build and include `gen:dts:check` in install pipeline.
    -   Dev dependencies refreshed, adding `typescript`, `tsd-jsdoc`, and updating various `@types/*`, jest, jsdoc toolchain packages.

-   Removed

    -   Legacy type files under `types/` (`jsmind.d.ts`, `jsmind.draggable-node.d.ts`, `jsmind.screenshot.d.ts`) in favor of `types/generated/`.

-   Notes

    -   Running `npm test` now validates both runtime tests and TypeScript definitions. Consumers can rely on the aggregated public typings from the package root; plugin typings are exposed under `plugins/` paths.

### 2025-08-09

-   Added

    -   TypeScript support: publish `.d.ts` for core and plugins (`es6/jsmind.d.ts`, `es6/jsmind.draggable-node.d.ts`, `es6/jsmind.screenshot.d.ts`).
    -   Type checking in CI: added Jest test `tests/unit/typescript.types.test.js` using TypeScript Compiler API to verify typings with `tsconfig.json` (noEmit).

-   Changed

    -   Updated root `package.json` to expose `types` and proper `exports` fields for typings.

-   Notes

    -   The TS example `example/typescript-test.ts` is included in `tsconfig.json#includes` for compile-time verification.
    -   Running `npm test` will now validate TypeScript definitions.
