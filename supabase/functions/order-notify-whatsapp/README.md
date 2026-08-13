# order-notify-whatsapp

Supabase Edge Function to send WhatsApp messages via Twilio when a new order is placed.

Required secrets (set with `supabase secrets set`):

- `TWILIO_ACCOUNT_SID` - your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - your Twilio Auth Token
- `TWILIO_WHATSAPP_FROM` - Twilio WhatsApp-enabled number (international without +, e.g. 1415xxxxxxx)
- `SUPABASE_ADMIN_WHATSAPP` - admin WhatsApp number (international without +), optional (defaults to 212635939690)

Deploy:

```bash
supabase functions deploy order-notify-whatsapp

supabase secrets set TWILIO_ACCOUNT_SID="your_sid"
supabase secrets set TWILIO_AUTH_TOKEN="your_token"
supabase secrets set TWILIO_WHATSAPP_FROM="1415xxxxxxx"
supabase secrets set SUPABASE_ADMIN_WHATSAPP="2126xxxxxxx"
```

Test locally:

```bash
supabase functions serve order-notify-whatsapp
# then POST to http://localhost:54321/functions/v1/order-notify-whatsapp
# with JSON body:
# { "phone": "2126xxxxxxx", "plan": "3_months", "amount": 29.99, "status": "paid" }
```
