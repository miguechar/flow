import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, appointments, appointmentRequests, policies } from "@workspace/db"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { headers } from "next/headers"

const bookSchema = z.object({
  requestId: z.string(),
  date: z.string(),
  startTime: z.string(),
  duration: z.number().default(60),
  serviceType: z.string(),
  stripeSetupIntentId: z.string(),
  stripeCustomerId: z.string(),
  stripePaymentMethodId: z.string(),
  stripeLast4: z.string(),
  policyAgreed: z.boolean().refine((v) => v === true, "Must agree to policy"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = bookSchema.parse(body)

    // Verify the request is approved for this user's email
    const [request] = await db
      .select()
      .from(appointmentRequests)
      .where(
        and(
          eq(appointmentRequests.id, data.requestId),
          eq(appointmentRequests.status, "approved")
        )
      )
      .limit(1)

    if (!request) {
      return NextResponse.json(
        { error: "Appointment request not found or not approved" },
        { status: 404 }
      )
    }

    // Verify email matches
    if (request.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const id = crypto.randomUUID()
    await db.insert(appointments).values({
      id,
      requestId: data.requestId,
      userId: session.user.id,
      date: data.date,
      startTime: data.startTime,
      duration: data.duration,
      serviceType: data.serviceType,
      stripeSetupIntentId: data.stripeSetupIntentId,
      stripeCustomerId: data.stripeCustomerId,
      stripePaymentMethodId: data.stripePaymentMethodId,
      stripeLast4: data.stripeLast4,
      policyAgreedAt: new Date(),
      status: "scheduled",
    })

    // Link the user to the request
    await db
      .update(appointmentRequests)
      .set({ userId: session.user.id })
      .where(eq(appointmentRequests.id, data.requestId))

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, session.user.id))

    return NextResponse.json(userAppointments)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
