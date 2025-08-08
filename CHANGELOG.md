## Changelog / 变更日志

### 2025-08-09

- Added / 新增
  - TypeScript support: publish `.d.ts` for core and plugins (`es6/jsmind.d.ts`, `es6/jsmind.draggable-node.d.ts`, `es6/jsmind.screenshot.d.ts`).
  - Type checking in CI: added Jest test `tests/unit/typescript.types.test.js` using TypeScript Compiler API to verify typings with `tsconfig.json` (noEmit).

- Changed / 调整
  - Updated root `package.json` to expose `types` and proper `exports` fields for typings.

- Notes / 说明
  - The TS example `example/typescript-test.ts` is included in `tsconfig.json#includes` for compile-time verification.
  - Running `npm test` will now validate TypeScript definitions.


