import { db } from "@repo/db/db";
import { appointments, user } from "@repo/db/schema";
import { eq } from "@repo/db/drizzle";
import { AppointmentsTable } from "./appointments-table";

export default async function AppointmentsPage() {
  const rows = await db
    .select({
      id: appointments.id,
      date: appointments.date,
      startTime: appointments.startTime,
      duration: appointments.duration,
      serviceType: appointments.serviceType,
      status: appointments.status,
      stripePaymentMethodId: appointments.stripePaymentMethodId,
      stripeCustomerId: appointments.stripeCustomerId,
      stripeLast4: appointments.stripeLast4,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(appointments)
    .leftJoin(user, eq(appointments.userId, user.id))
    .orderBy(appointments.date);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          View all booked sessions and charge clients after their appointment.
        </p>
      </div>
      <AppointmentsTable initialAppointments={rows} />
    </div>
  );
}
