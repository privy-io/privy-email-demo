# Privy Email Demo

This project aims to showcase the new email sending functionality and demonstrate the business and consumer aspects of the Privy APIs:

- [The end-user experience](#end-user-experience) (`/`)
  - SIWE, privy-browser
- [A email send management UI](#email-send-management-ui) (`/admin`)
  - privy-node (user fetching, send email)
- [A configuration script for managing your Privy instance](#privy-instance-configuration)

## Setup

### Privy instance configuration

We have created a convenience script, `npm run setup-app` that automatically configures your Privy instance with the required setup. You can also use this as a reference for using the configuration-related methods of @privy-io/privy-node by reading through `/scripts/setup-app.mjs`.

This demo requires two fields, `email`, and `signup-topic`, and an access group that allows users to read/write their signup topic and email, as well as admins to read that signup topic and email. We leverage the default `self` and `admin` roles for use in the access group.

### Copy env vars

1. Copy  `.env.local.example` to `.env.local`
2. Populate with your local API Key + Secret (using console or API directly)

By default, the actual send call is disabled. You can enable sending by setting the environment variable **`SEND_ENABLED=true`**.

### Install and run deps

```sh
npm install
npm run dev
```

## Demos

### End-user experience

A mock landing page meant to capture a user's email address.

It features:
- Simple data storage using `@privy-io/privy-browser`
- SIWE-provided Privy access token with `self` permissions

<img width="824" alt="screenshot showing the mock landing page with a 'sign up' email CTA in the center" src="https://user-images.githubusercontent.com/1669563/161342075-ed62d633-cb85-4cba-81b9-42aaabf5bee8.png">


### Email send management UI

A mock admin console for business customers of Privy that allows sending of arbitrary emails to groups of end-users.

It features:
- A mock admin customer-controlled "auth" system, which in turn grants an "access token" that can be used to verify whether the current admin user can perform a potentially privileged `@privy-io/privy-node` action, powered by the `/api/auth` routes
- A list of current users, backed by `/api/users`
- A basic send email UI to target, which is backed by a generic `/api/send-email` endpoint

<img width="1020" alt="screenshot showing a list of users with the option to send email" src="https://user-images.githubusercontent.com/1669563/161341983-62060470-1fa1-49e4-9dd0-b33b31273302.png">
<img width="1025" alt="screenshot showing the email send UI" src="https://user-images.githubusercontent.com/1669563/161342000-03be7296-6749-46a5-afc3-5310812f04bd.png">

## Backend routes

Routes are protected by `errorMiddleware`, which by default handles and formats errors.

- `/api/auth` mocks a customer auth route or auth provider route and grants a fake token and user object
- `/api/send-email` is a simple API pass-through to the privy node `sendEmail` method
- `/api/users` gets all Privy users in your space

## Technologies

- [Tailwind CSS](https://tailwindcss.com/) for styling. Don't be alarmed at the volume of styling directly in HTML - this is an intentional practice by the Tailwind team.
- Next.js for generation + rendering, as well as for the backend API routes (located in `/pages/api/*`)
- [`SWR`](https://swr.vercel.app/) for GET querying
- `eslint` for formatting. Run `npm run lint` to check.
