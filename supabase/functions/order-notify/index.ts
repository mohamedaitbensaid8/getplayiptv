import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const ADMIN_EMAIL = Deno.env.get("SUPABASE_ADMIN_EMAIL") ?? "getplayiptv@gmail.com";
const EMAIL_SENDER = Deno.env.get("SUPABASE_EMAIL_SENDER") ?? "no-reply@getplayiptv.com";
const SENDGRID_API_KEY = Deno.env.get("SUPABASE_SENDGRID_API_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST requests are accepted." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!SENDGRID_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing SUPABASE_SENDGRID_API_KEY." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { email, plan, amount, status } = payload;

  if (!email || !plan || amount == null || !status) {
    return new Response(JSON.stringify({ error: "Required fields missing: email, plan, amount, status." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subject = `New IPTV order: ${plan} (${status})`;
  const message = `A new order has been received:\n\nEmail: ${email}\nPlan: ${plan}\nAmount: $${amount}\nStatus: ${status}\n\nPlease process this order and send activation details to the customer.`;

  const sendGridPayload = {
    personalizations: [
      {
        to: [{ email: ADMIN_EMAIL }],
        subject,
      },
    ],
    from: {
      email: EMAIL_SENDER,
      name: "getplayiptv Orders",
    },
    content: [
      {
        type: "text/plain",
        value: message,
      },
    ],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendGridPayload),
  });

  if (!response.ok) {
    const detail = await response.text();
    return new Response(JSON.stringify({ error: "SendGrid request failed.", detail }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Admin notification email sent." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
