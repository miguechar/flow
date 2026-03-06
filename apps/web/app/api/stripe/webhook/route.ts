import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db, appointments } from "@workspace/db"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env["STRIPE_WEBHOOK_SECRET"]!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "setup_intent.succeeded": {
      const setupIntent = event.data.object
      // Payment method saved — update appointment record
      await db
        .update(appointments)
        .set({ stripePaymentMethodId: setupIntent.payment_method as string })
        .where(eq(appointments.stripeSetupIntentId, setupIntent.id))
      break
    }
    case "payment_intent.succeeded": {
      // Payment charged — mark appointment as completed if needed
      break
    }
  }

  return NextResponse.json({ received: true })
}
