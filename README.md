# next-cas-client [![CI](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/actions/workflows/ci.yml/badge.svg)](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/actions/workflows/ci.yml) ![Coverage](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/blob/badges/badges/coverage-jest%20coverage.svg) [![GitHub license](https://img.shields.io/github/license/uhawaii-system-its-ti-iam/next-cas-client?style=flat)](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/blob/master/LICENSE)

_Maintained by the University of Hawaiʻi._

Designed for Next.js, `next-cas-client` serves as an API platform to interact with a CAS server to authenticate, validate tickets, and provide session management (powered by [iron-session](https://github.com/vvo/iron-session)).

Currently supports CAS 2.0, CAS 3.0 and SAML 1.1 service validation methods.

**Contributions to this repo to support more validation protocols is highly encouraged!** (See [contributing](#contributing))

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Installation](#1-installation)
    -   [Set Environment Variables](#2-set-environment-variables)
    -   [Add API Route](#3-add-api-route)
-   [Usage](#usage)
    -   [`login(): void`](#login-void-client-side-only)
    -   [`logout(): void`](#logout-void-client-side-only)
    -   [`getCurrentUser<T>(): Promise<T = CasUser | null>`](#getcurrentusert-promiset--casuser--null-server-side-only)
    -   [`isLoggedIn(): Promise<boolean>`](#isloggedin-promiseboolean-server-side-only)
-   [Examples](#examples)
-   [Contributing](#contributing)
-   [FAQ](#faq)
    -   [Is there support for other React frameworks like Vite and Remix?](#is-there-support-for-other-react-frameworks-like-vite-and-remix)
    -   [How do I use `getCurrentUser()` and `isLoggedIn()` in a client component?](#how-do-i-use-getcurrentuser-and-isloggedin-in-a-client-component)
    -   [How do I resolve the error when importing `login()` and `logout()` from `'next-cas-client/client'`?](#how-do-i-resolve-the-error-when-importing-login-and-logout-from-next-cas-clientclient)

## Getting Started

### 1. Installation

```bash
# Using npm:
npm i next-cas-client

# Using pnpm:
pnpm add next-cas-client

# Using yarn:
yarn add next-cas-client
```

### 2. Set Environment Variables

`.env`:

```
NEXT_PUBLIC_BASE_URL=https://example.com
NEXT_PUBLIC_CAS_URL=https://cas.example.com/cas
NEXT_CAS_CLIENT_SAML_TOLERANCE=18000
```

-   `NEXT_PUBLIC_BASE_URL` **(Required)**: The URL to redirect to after logging-in/out
-   `NEXT_PUBLIC_CAS_URL` **(Required)**: The URL prefix of your CAS server
-   `NEXT_CAS_CLIENT_SAML_TOLERANCE` _(Optional)_: The tolerance in milliseconds for drifting clocks when validating SAML tickets. Only applies to SAML 1.1 validation. Defaults to 1000 milliseconds.

`.env.local`:

```
NEXT_CAS_CLIENT_SECRET=GenerateA32CharacterLongPassword
```

-   `NEXT_CAS_CLIENT_SECRET` **(Required)**: The secret used to encrypt/decrypt the session stored as a cookie. It must be greater than 32 characters long. Use https://1password.com/password-generator to generate a password.

### 3. Add API Route

**App Router:** `app/api/cas/[client]/route.ts`:

```ts
import { handleAuth, ValidatorProtocol } from 'next-cas-client';

export const GET = handleAuth({ validator: ValidatorProtocol.SAML11 });
```

**Page Router:** `pages/api/cas/[client].ts`:

```ts
import { handleAuth, ValidatorProtocol } from 'next-cas-client';

export default handleAuth({ validator: ValidatorProtocol.SAML11 });
```

**handleAuth() Options:**

-   `validator` **(Required)**: The ValidatorProtocol enum
    -   `ValidatorProtocol.CAS20` for CAS 2.0 service validation
    -   `ValidatorProtocol.CAS20` for CAS 3.0 service validation
    -   `ValidatorProtocol.SAML11` for SAML 1.1 validation
-   `loadUser` _(Optional)_: Function to redefine the user object stored in session.

    -   Parameters: `casUser: CasUser`
    -   Returns: `any | promise<any>`
    -   If a `loadUser` function is not passed in, the stored user in session defaults to a object of type `CasUser`:
        ```ts
        type CasUser = {
            user: string;
            attributes: record<string, string | string[]>;
        };
        ```
    -   **Example:** Using `loadUser` to redefine the user and store authorization roles:

        ```ts
        import { handleAuth, ValidatorProtocol } from 'next-cas-client';

        async function loadUser(casUser: CasUser) {
            const user = {
                uid: casUser.user
                name: casUser.attributes.name,
                email: casUser.attributes.email,
                roles: []
            }

            await setRoles(user); // Makes API call(s) to retrieve and set the user's roles
            return user;
        }

        export default handleAuth({ loadUser, validator: ValidatorProtocol.SAML11 });
        ```

## Usage

### `login(): void` (Client-Side Only)

Visits the CAS login page.

```jsx
'use client';

import { login } from 'next-cas-client/client';

<button onClick={() => login()}>Login</button>;
```

**login() Options:**

-   `renew` _(Optional)_: Boolean, `true` to disallow SSO. Defaults to `false`.

### `logout(): void` (Client-Side Only)

Visits the CAS logout page.

```jsx
'use client';

import { login } from 'next-cas-client/client';

<button onClick={() => logout()}>Logout</button>;
```

**logout() Options:**

-   `enableSLO` _(Optional)_: Boolean, `true` to enable SLO (Single Logout). Destroys current SSO session. Defaults to `false`.

### `getCurrentUser<T>(): Promise<T = CasUser | null>` (Server-Side Only)

Gets the current user. Returns `null` if no user is logged-in.

```ts
const currentUser = await getCurrentUser();
```

Returns an object of type `CasUser` by default. Define the generic type of `getCurrentUser()` if you used the `loadUser` option in `handleAuth()`. The type should match the return of the `loadUser` function you defined.

-   Example:

    ```ts
    type User = {
        uid: string;
        name: string;
        email: string;
        roles: string[];
    };

    const currentUser = await getCurrentUser<User>();
    ```

### `isLoggedIn(): Promise<boolean>` (Server-Side Only)

Returns `true` if a user is logged-in.

```ts
const isLoggedIn = await isLoggedIn();
```

## Examples

A fully functional demo is available using Docker.

To start:

1. Clone or download this repo
2. Change directory to `/examples`
3. Execute `docker compose up`. A CAS server for demo purposes will launch at https://localhost:8443/cas
4. Change directory to `/app-router` or `/pages-router` depending on the router you would like to view the example for
5. Execute `npm run dev`. The Next.js example app will be available at http://localhost:3000

**Note:** You may encounter a `NET:ERR_CERT_INVALID` error in your browser when attempting to visit the CAS login page. Bypass the error by trusting the page. The browser is attempting to protect you from visiting a suspicious secure site at https://localhost.

## Contributing

Please open a new issue before creating a PR. This project is currently focusing on supporting more ticket validation protocols. Any other issues and PRs created out of this scope may be rejected.

For more information on how to contribute, view [here](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/blob/main/CONTRIBUTING.md).

## FAQ

### Is there support for other React frameworks like Vite and Remix?

No, not at this moment.

### How do I use `getCurrentUser()` and `isLoggedIn()` in a client component?

It is recommended to use those functions inside a server component then pass them as props into a client component.

### How do I resolve the error when importing `login()` and `logout()` from `'next-cas-client/client'`?

In your project's `tsconfig.json`, set `compilerOptions.moduleResolution` to "bundler".
