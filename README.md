# Selfcare Token Exchange Frontend

Single-page React/TypeScript application that redirects authenticated Selfcare
users to a product's back office. It retrieves the destination from the dashboard
API and displays an error page if the request fails.

The application uses Vite, MUI Italia, shared components and authentication from
`@pagopa/selfcare-common-frontend`, and React Router.

## Local setup

Use the Node.js version specified in [`.node-version`](.node-version) and Yarn
Classic (1.x).

```sh
yarn install
yarn start
```

Open `http://localhost:3000/token-exchange`. Development mode enables the shared
library's mock user and Redux logging; accessing a real back office still requires
valid API credentials.

Vite loads environment configuration from `.env` and mode-specific files such as
`.env.development.local`. Configure the values for your environment before
starting the server:

| Variable | Purpose |
| --- | --- |
| `VITE_URL_API_DASHBOARD` | Dashboard API base URL |
| `VITE_URL_FE_LOGIN` | Login page URL |
| `VITE_URL_FE_LANDING` | Landing/logout URL and error-page home destination |

Additional assistance and analytics settings are mapped in
[`src/utils/env.ts`](src/utils/env.ts). Environment values are embedded in the
frontend bundle and must not contain secrets.

## Redirect flow

Example request:

```text
http://localhost:3000/token-exchange?institutionId=123&productId=prod-example
```

| Query parameter | Required | Purpose |
| --- | --- | --- |
| `institutionId` | Yes | Institution requesting access |
| `productId` | Yes | Target product |
| `environment` | No | Environment forwarded to the dashboard API |
| `redirectUrl` | No | Value added to the destination URL's query string |

After authentication, the page calls
`GET /v2/products/{productId}/back-office` with `institutionId`, optional
`environment`, and the current language. The request includes cookies and the
stored Bearer token. The API returns a JSON string containing the destination URL.
When adding `redirectUrl`, the page preserves the destination's fragment.

## Build and validation

| Task | Command |
| --- | --- |
| Typecheck and production build | `yarn build` |
| Preview the production build | `yarn preview` |
| Run all tests once | `yarn vitest run` |
| Run tests in watch mode | `yarn test` |
| Run tests with coverage | `yarn test:coverage` |
| Run one test file | `yarn vitest run src/pages/TokenExchange/__tests__/TokenExchange.test.tsx` |
| Run one test by name | `yarn vitest run src/pages/TokenExchange/__tests__/TokenExchange.test.tsx -t "Throw error and click on back button"` |
| Lint | `yarn lint` |
| Autofix lint | `yarn lint-autofix` |

The production bundle is written to `dist/` and served under `/token-exchange`.
The preview server defaults to port 3000.

Tests use Vitest, React Testing Library, and jsdom. CI runs the build, lint, and
coverage commands.
