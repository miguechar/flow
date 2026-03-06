import { headers } from "next/headers";
import { adminAuth } from "@repo/auth/auth";
import { appointmentRequests, appointments, user } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { eq, count } from "@repo/db/drizzle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ClipboardListIcon,
  CalendarCheckIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await adminAuth.api.getSession({ headers: await headers() });

  const [pendingCount] = await db
    .select({ count: count() })
    .from(appointmentRequests)
    .where(eq(appointmentRequests.status, "pending"));

  const [scheduledCount] = await db
    .select({ count: count() })
    .from(appointments)
    .where(eq(appointments.status, "scheduled"));

  const [clientCount] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "client"));

  const recentRequests = await db
    .select()
    .from(appointmentRequests)
    .orderBy(appointmentRequests.createdAt)
    .limit(5);

  const stats = [
    {
      label: "Pending Requests",
      value: pendingCount?.count ?? 0,
      icon: ClipboardListIcon,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      label: "Upcoming Appointments",
      value: scheduledCount?.count ?? 0,
      icon: CalendarCheckIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Clients",
      value: clientCount?.count ?? 0,
      icon: UsersIcon,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good morning, {session?.user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening at Flow Massage today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div
                className={`size-9 rounded-lg ${bg} flex items-center justify-center`}
              >
                <Icon className={`size-5 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent requests */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
        {recentRequests.length === 0 ? (
          <div className="text-muted-foreground text-sm py-8 text-center border rounded-lg bg-muted/20">
            No requests yet. Requests from clients will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium text-sm">{req.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.email} · {req.serviceType}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    req.status === "pending"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : req.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <ClockIcon className="size-3" />
                  {req.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
