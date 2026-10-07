# getplayiptv

This repository contains the public frontend files for the getplayiptv website.

## What to keep in GitHub

- `index.html`
- `robots.txt`
- `sitemap.xml`
- `vercel.json`
- image assets and icons needed by the website

## PayPal checkout

The website uses Vercel serverless functions to create and capture PayPal orders. Prices are defined on the server in `api/paypal/create-order.js`; the browser cannot set or change them. The PayPal secret is only read by the server and must never be added to frontend code or committed to Git.

Configure these environment variables in the Vercel project settings:

- `PAYPAL_CLIENT_ID` — the REST app client ID for the selected PayPal environment
- `PAYPAL_CLIENT_SECRET` — the matching REST app secret
- `PAYPAL_ENV` — `sandbox` while testing; change to `live` only after successful tests and PayPal account approval

Create a REST app in the PayPal Developer Dashboard and use its sandbox credentials first. Add the environment variables to Vercel's Development/Preview environments for testing. After a successful sandbox checkout, add the live credentials to the Production environment and set `PAYPAL_ENV=live`. Redeploy after changing environment variables.

Payment is verified by the capture API before a success message is shown. Subscription activation is still handled manually by emailing the buyer; this project does not yet deliver credentials automatically. Test successful payments, cancellations, and failed payments in Sandbox before accepting live payments.
