import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, appointmentRequests } from "@workspace/db"
import { headers } from "next/headers"
import { desc } from "drizzle-orm"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const requests = await db
    .select()
    .from(appointmentRequests)
    .orderBy(desc(appointmentRequests.createdAt))

  return NextResponse.json(requests)
}
