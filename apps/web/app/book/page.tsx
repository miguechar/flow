import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/repo/auth/auth"
import {db} from "@repo/db/db"
import { eq, and } from "@repo/db/drizzle"
import { BookingFlow } from "./booking-flow"

export const metadata: Metadata = {
  title: "Book Your Appointment | Flow Massage",
}

export default async function BookPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/auth/sign-in?callbackUrl=/book")

  // Find approved request for this user's email
  const [request] = await db
    .select()
    .from(appointmentRequests)
    .where(
      and(
        eq(appointmentRequests.email, session.user.email),
        eq(appointmentRequests.status, "approved")
      )
    )
    .limit(1)

  // Check if they already have a scheduled appointment
  if (request) {
    const [existing] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.requestId, request.id),
          eq(appointments.status, "scheduled")
        )
      )
      .limit(1)

    if (existing) {
      return <AppointmentConfirmed appointment={existing} />
    }
  }

  if (!request) {
    return <NoPendingRequest email={session.user.email} />
  }

  return (
    <BookingFlow
      request={request}
      userEmail={session.user.email}
      userName={session.user.name}
    />
  )
}

function NoPendingRequest({ email }: { email: string }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16">
      <div className="text-center max-w-sm space-y-4">
        <div className="size-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <span className="text-2xl">🌿</span>
        </div>
        <h2 className="text-xl font-semibold">No Approved Request Yet</h2>
        <p className="text-muted-foreground text-sm">
          We don&apos;t have an approved booking request for{" "}
          <strong>{email}</strong> yet. Once your therapist approves your
          request, you&apos;ll be able to choose your appointment time here.
        </p>
        <p className="text-muted-foreground text-xs">
          Haven&apos;t requested yet?{" "}
          <a href="/request" className="underline text-primary">
            Submit a request
          </a>
        </p>
      </div>
    </div>
  )
}

function AppointmentConfirmed({ appointment }: { appointment: { date: string; startTime: string; serviceType: string } }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16">
      <div className="text-center max-w-sm space-y-4">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-xl font-semibold">You&apos;re All Set!</h2>
        <p className="text-muted-foreground text-sm">
          Your <strong>{appointment.serviceType}</strong> appointment is scheduled
          for <strong>{appointment.date}</strong> at{" "}
          <strong>{appointment.startTime}</strong>.
        </p>
        <p className="text-muted-foreground text-xs">
          Questions? Contact us at{" "}
          <a href="mailto:hello@flowmassage.com" className="underline">
            hello@flowmassage.com
          </a>
        </p>
      </div>
    </div>
  )
}
