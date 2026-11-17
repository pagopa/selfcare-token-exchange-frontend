# Repository instructions

## Build, test, and lint

Use the Node version in `.node-version` and Yarn Classic; dependency changes must
update `package.json` and `yarn.lock`.

| Task | Command |
| --- | --- |
| Install dependencies | `yarn install` |
| Start Vite development server | `yarn start` |
| Typecheck and production build | `yarn build` |
| Preview production build | `yarn preview` |
| Run all tests once | `yarn vitest run` |
| Run tests with coverage | `yarn test:coverage` |
| Run one test file | `yarn vitest run src/pages/TokenExchange/__tests__/TokenExchange.test.tsx` |
| Run one test by name | `yarn vitest run src/pages/TokenExchange/__tests__/TokenExchange.test.tsx -t "Throw error and click on back button"` |
| Watch tests | `yarn test` |
| Lint | `yarn lint` |
| Autofix lint | `yarn lint-autofix` |
| Check formatting of changed files | `yarn prettier --check <file-paths>` |

`yarn build` runs `tsc` before Vite and writes the bundle to `dist/`. Development
and preview servers default to port 3000. CI runs build, lint, and coverage.

## Architecture

This is a React/TypeScript Vite application serving a single authenticated
redirect page, not a multi-page dashboard. Vite's base, the `BrowserRouter`
basename in `src/index.tsx`, and the CDN deployment base path are all
`/token-exchange`; keep them aligned. Import routing APIs from `react-router`.

`src/index.tsx` initializes shared-library configuration, localization, and
analytics/consent setup, then mounts Redux, the MUI Italia theme, and the router.
`App` places the shared error boundary, loading overlay, and unload-event handler
around `Layout` and `TokenExchange`. `Layout` supplies the shared header/footer
and routes their exit actions through `useUnloadEventOnExit`.

`TokenExchange` is exported through the shared `withLogin` decorator. It reads
`productId`, `institutionId`, optional `environment`, and optional `redirectUrl`
from the browser query string, and reads the authentication token through
`storageTokenOps`. With both required IDs, it fetches
`/v2/products/{productId}/back-office` from the configured dashboard API using
cookies and a Bearer token. The response is a JSON string containing the target
URL. It navigates with `location.href`; an optional `redirectUrl` is added as a
query parameter while preserving the target's fragment, which can contain the
token. Request failures render the error illustration and home action.

## Shared-library and configuration conventions

- Authentication, storage, header/footer, error/loading handling, and Redux
  slices come from `@pagopa/selfcare-common-frontend`; MUI Italia provides the
  theme and illustrations. Changes to these packages affect the whole shell,
  not just the redirect component.
- The Redux store must register the shared reducers under `user` and `appState`,
  as required by the library's selectors and hooks. `createStore()` provides
  isolated stores for tests; typed application hooks live in `src/redux/hooks.ts`.
- Read application environment values through `src/utils/env.ts`, which maps
  Vite's `import.meta.env.VITE_*` variables. Shared components instead consume
  the library's mutable `CONFIG`, configured at startup. Preserve the existing
  `ANALYTCS` spelling used by that interface. Analytics configuration must run
  before importing the library's `consentManagementConfigure` side effect.
- Login configuration includes the encoded current path and query in
  `onSuccess`. Development enables the library's mock user and Redux logging
  through `src/utils/constants.ts`.
- Localization extends the shared i18next instance using `configureI18n` in
  `src/locale/index.ts`. Page copy uses `Trans` keys with inline Italian
  fallbacks; local Italian resources live in `src/locale/it.ts`.

## Testing and code conventions

Vitest uses jsdom, global test APIs, jest-dom matchers from `src/setupTests.ts`,
and automatic mock clearing/reset/restoration. MUI Italia is inlined in
`vitest.config.ts` for dependency loading.

The page tests explicitly mock `withLogin` using the local decorator mock,
which populates the shared user slice. They mock `fetch` and the browser
location to inspect external redirects without navigating. The application
integration test instead renders the real shared layout and authentication
wrapper under the MUI theme and basename router with an authenticated store;
retain this distinction when testing shared-library compatibility.

ESLint enables `functional/no-let` and `functional/immutable-data`; necessary
mutations such as shared `CONFIG` setup and browser navigation use scoped
disables. TypeScript enforces strict typing and unused locals/parameters.
Prettier uses single quotes, semicolons, a 100-character print width, and ES5
trailing commas.

Pull request descriptions use `.github/PULL_REQUEST_TEMPLATE.md`, including
its change/context sections and documentation checklist.
