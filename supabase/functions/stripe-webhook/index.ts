// @ts-ignore
import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    return new Response("Webhook inválido", { status: 400 });
  }

  // 💰 pago ok
  if (event.type === "invoice.payment_succeeded") {

    const invoice = event.data.object;
    const subId = invoice.subscription;

    await supabase
      .from("agencias")
      .update({
        estado_suscripcion: "activa",
        ultimo_pago: new Date()
      })
      .eq("stripe_subscription_id", subId);
  }

  // ❌ fallo
  if (event.type === "invoice.payment_failed") {

    const invoice = event.data.object;
    const subId = invoice.subscription;

    await supabase
      .from("agencias")
      .update({
        estado_suscripcion: "vencida"
      })
      .eq("stripe_subscription_id", subId);
  }

  // 🚫 cancelación
  if (event.type === "customer.subscription.deleted") {

    const sub = event.data.object;

    await supabase
      .from("agencias")
      .update({
        estado_suscripcion: "cancelada"
      })
      .eq("stripe_subscription_id", sub.id);
  }

  return new Response("ok", { status: 200 });
});