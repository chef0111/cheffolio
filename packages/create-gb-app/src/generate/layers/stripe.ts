import { setFile } from "../files.ts";
import { isStart } from "../paths.ts";
import type { EmitCtx } from "../types.ts";

export function emitStripe(ctx: EmitCtx): void {
  ctx.pkg.dependencies.stripe = "^18.5.0";
  const webhookPath = isStart(ctx.stack)
    ? "src/routes/api/stripe/webhook.ts"
    : ctx.stack.backend === "nest"
      ? "apps/server/src/stripe.webhook.ts"
      : "app/api/stripe/webhook/route.ts";
  const portalPath = isStart(ctx.stack)
    ? "src/routes/portal.tsx"
    : ctx.stack.backend === "nest"
      ? "apps/web/app/portal/page.tsx"
      : "app/portal/page.tsx";
  const checkoutPath = isStart(ctx.stack)
    ? "src/routes/api/stripe/checkout.ts"
    : ctx.stack.backend === "nest"
      ? "apps/server/src/stripe.checkout.ts"
      : "app/api/stripe/checkout/route.ts";

  setFile(
    ctx.files,
    webhookPath,
    `export async function POST(request: Request) {
  const stripe = new (await import("stripe")).default(process.env.STRIPE_SECRET_KEY as string);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("missing signature", { status: 400 });
  }
  stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  return new Response("ok");
}
`,
  );
  setFile(
    ctx.files,
    portalPath,
    `export default function PortalPage() {
  return (
    <main>
      <h1>Customer portal</h1>
      <form action="/api/stripe/portal" method="post">
        <button type="submit">Open portal</button>
      </form>
    </main>
  );
}
`,
  );
  setFile(
    ctx.files,
    checkoutPath,
    `export async function POST() {
  const stripe = new (await import("stripe")).default(process.env.STRIPE_SECRET_KEY as string);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: "http://localhost:3000/notes",
    cancel_url: "http://localhost:3000/notes",
  });
  return Response.redirect(session.url ?? "/notes", 303);
}
`,
  );

  const env = ctx.files[".env"] ?? "";
  const extra = `STRIPE_SECRET_KEY="sk_test_replace_me"
STRIPE_WEBHOOK_SECRET="whsec_replace_me"
STRIPE_PRO_PRICE_ID="price_pro"
`;
  setFile(ctx.files, ".env", `${env}${extra}`);
  setFile(ctx.files, ".env.example", `${ctx.files[".env.example"] ?? env}${extra}`);
}
