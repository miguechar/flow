import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@repo/auth/auth";
import { stripe } from "@/lib/stripe";
import { appointments } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { eq } from "@repo/db/drizzle";
import { headers } from "next/headers";
import { z } from "zod";

async function requireAdmin() {
  const session = await adminAuth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

const chargeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { amount, description } = chargeSchema.parse(body);

  const [appointment] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 },
    );
  }

  if (!appointment.stripeCustomerId || !appointment.stripePaymentMethodId) {
    return NextResponse.json(
      { error: "No payment method on file" },
      { status: 400 },
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: "usd",
    customer: appointment.stripeCustomerId,
    payment_method: appointment.stripePaymentMethodId,
    confirm: true,
    off_session: true,
    description: description ?? `Flow Massage — ${appointment.serviceType}`,
  });

  // Update appointment status to completed
  await db
    .update(appointments)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(appointments.id, id));

  return NextResponse.json({
    success: true,
    paymentIntentId: paymentIntent.id,
  });
}
