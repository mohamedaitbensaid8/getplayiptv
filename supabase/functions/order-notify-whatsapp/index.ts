import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM"); // phone in international format without plus, e.g. 1415xxxxxxx
const ADMIN_WHATSAPP = Deno.env.get("SUPABASE_ADMIN_WHATSAPP") || Deno.env.get("ADMIN_WHATSAPP") || "212783086770";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return new Response(JSON.stringify({ error: "Twilio credentials not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const { phone, plan, amount, status, customer_name } = payload;
  if (!phone || !plan) {
    return new Response(JSON.stringify({ error: "Required fields: phone, plan" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const to = `whatsapp:+${cleanPhone}`;
  const from = `whatsapp:+${TWILIO_WHATSAPP_FROM}`;

  const customerMessage = `Thank you for your order${customer_name ? `, ${customer_name}` : ''}!\nPlan: ${plan}\nAmount: $${amount || '0.00'}\nStatus: ${status || 'pending'}\n\nWe will send your activation details shortly.`;

  const adminMessage = `New order received:\nPhone: ${cleanPhone}\nPlan: ${plan}\nAmount: $${amount || '0.00'}\nStatus: ${status || 'pending'}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

  // Helper to send to Twilio
  async function sendTwilioMsg(toNumber: string, body: string) {
    const form = new URLSearchParams();
    form.append('From', from);
    form.append('To', toNumber);
    form.append('Body', body);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    });

    const text = await resp.text();
    return { ok: resp.ok, status: resp.status, text };
  }

  try {
    // Send message to customer
    const resultCustomer = await sendTwilioMsg(to, customerMessage);
    if (!resultCustomer.ok) {
      console.error('Twilio customer send failed', resultCustomer);
    }

    // Send message to admin (optional)
    try {
      await sendTwilioMsg(`whatsapp:+${ADMIN_WHATSAPP}`, adminMessage);
    } catch (e) {
      console.error('Failed to notify admin via Twilio', e);
    }

    return new Response(JSON.stringify({ message: 'WhatsApp messages queued', customer: resultCustomer }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Unexpected error sending Twilio message', err);
    return new Response(JSON.stringify({ error: 'Failed to send messages', detail: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
