import { db, user } from "@workspace/db"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"

export default async function ClientsPage() {
  const clients = await db
    .select()
    .from(user)
    .where(eq(user.role, "client"))
    .orderBy(user.createdAt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          All clients who have signed in to book an appointment.
        </p>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No clients yet.
                </TableCell>
              </TableRow>
            )}
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(client.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${client.emailVerified ? "text-green-600" : "text-amber-600"}`}>
                    {client.emailVerified ? "Verified" : "Pending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
