// @ts-ignore
import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET")!, {
  apiVersion: "2023-10-16",
});

Deno.serve(async (req: Request) => {

  const { agencia_id } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{
      price: "price_xxx",
      quantity: 1,
    }],
    success_url: "http://127.0.0.1:5500/index.html",
    cancel_url: "http://127.0.0.1:5500/index.html",
    metadata: { agencia_id }
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
});