import { db, appointmentRequests } from "@workspace/db"
import { desc } from "drizzle-orm"
import { RequestsTable } from "./requests-table"

export default async function RequestsPage() {
  const requests = await db
    .select()
    .from(appointmentRequests)
    .orderBy(desc(appointmentRequests.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointment Requests</h1>
        <p className="text-muted-foreground">
          Review and approve or reject client appointment requests.
        </p>
      </div>
      <RequestsTable initialRequests={requests} />
    </div>
  )
}
