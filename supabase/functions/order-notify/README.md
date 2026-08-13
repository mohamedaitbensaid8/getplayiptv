# order-notify

This Supabase Edge Function sends an email notification for new IPTV orders using SendGrid.

## Required environment variables

- `SUPABASE_SENDGRID_API_KEY`: Your SendGrid API key.
- `SUPABASE_ADMIN_EMAIL`: The destination email for admin order notifications (default: `getplayiptv@gmail.com`).
- `SUPABASE_EMAIL_SENDER`: The verified sender email address for SendGrid (default: `no-reply@getplayiptv.com`).

## Deploying

1. Install and authenticate the Supabase CLI.
2. From the project root, run:
   ```bash
   supabase functions deploy order-notify
   ```
3. Set the secrets:
   ```bash
   supabase secrets set SUPABASE_SENDGRID_API_KEY="your_sendgrid_api_key"
   supabase secrets set SUPABASE_ADMIN_EMAIL="getplayiptv@gmail.com"
   supabase secrets set SUPABASE_EMAIL_SENDER="no-reply@getplayiptv.com"
   ```

## Local testing

Run the function locally with:

```bash
supabase functions serve order-notify
```

Then invoke it via POST request with a JSON body:

```json
{
  "email": "customer@example.com",
  "plan": "3_months",
  "amount": 29.99,
  "status": "paid"
}
```
