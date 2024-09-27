# next-cas-client

Built for Next.js, `next-cas-client` serves as an API platform to interact with a CAS server to authenticate, validate tickets, and provide session management (powered by [iron-session](https://github.com/vvo/iron-session)).

## Note

`next-cas-client` currently supports CAS 2.0, CAS 3.0 and SAML 1.1 service validation methods.
**Contributions to this repo to support more validation protocols is highly encouraged!**

## Resources

**[Changelog](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/blob/main/CHANGELOG.md)**

**[Examples](https://github.com/uhawaii-system-its-ti-iam/next-cas-client/blob/main/examples)**

## Getting Started

### Installation

```bash
# Using npm:
npm i next-cas-client

# Using pnpm:
pnpm add next-cas-client

# Using yarn:
yarn add next-cas-client
```

### Set Environment Variables

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

### Add API Route

App router: `app/api/cas/[client]/route.ts`:

```ts
import { handleAuth, ValidatorProtocol } from 'next-cas-client';

export const GET = handleAuth({ validator: ValidatorProtocol.SAML11 });
```

Pages router: `pages/api/cas/[client].ts/`:

```ts
import { handleAuth, ValidatorProtocol } from 'next-cas-client';

export default handleAuth({ validator: ValidatorProtocol.SAML11 });
```

**handleAuth() Options:**

-   `validator` **(Required)**: The ValidatorProtocol enum
    -   `ValidatorProtocol.CAS20` for CAS 2.0 service validation
    -   `ValidatorProtocol.CAS20` for CAS 3.0 service validation
    -   `ValidatorProtocol.SAML11` for SAML 1.1 validation
-   `loadUser` _(Optional)_: Define a function to redefine the user object stored in session.

    -   Parameters: `casUser: CasUser`
    -   Returns: `any | promise<any>`
    -   If a `loadUser` function is not passed in, the stored user in session defaults to a object of type `CasUser`:
        ```ts
        type CasUser = {
            user: string;
            attributes: record<string, string | string[]>;
        };
        ```
    -   _Recommended_: Use `loadUser` to store authorization roles

        -   Example:

            ```ts
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
            ```

            ```ts
            import { handleAuth, ValidatorProtocol } from 'next-cas-client';

            export default handleAuth({ loadUser, validator: ValidatorProtocol.SAML11 });
            ```

## Usage

### Client Components Only

#### `login(): void`

Visits the CAS login page.

```jsx
'use client';

import { login } from 'next-cas-client/client';

<button onClick={() => login()}>Login</button>;
```

**login() Options:**

-   `renew` _(Optional)_: Boolean, `true` to disallow SSO. Defaults to `false`.

#### `logout(): void`

Visits the CAS logout page.

```jsx
'use client';

import { login } from 'next-cas-client/client';

<button onClick={() => logout()}>Logout</button>;
```

**logout() Options:**

-   `enableSLO` _(Optional)_: Boolean, `true` to enable SLO (Single Logout). Destroys current SSO session. Defaults to `false`.

### Server Components Only

#### `getCurrentUser<T>(): promise<T = CasUser | null>`

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

#### `isLoggedIn(): promise<boolean>`

Returns `true` if a user is logged-in.

```ts
const isLoggedIn = await isLoggedIn();
```

### Middleware

## FAQ / Troubleshooting

1. How do I use `getCurrentUser()` and `isLoggedIn()` in a client component?
2. I am getting this error when importing `login()` and `logout()` from `'next-cas-client/client'`:
