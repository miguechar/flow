import { NextResponse } from "next/server";
import { adminAuth } from "@repo/auth/auth";
import { appointmentRequests } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { headers } from "next/headers";
import { desc } from "@repo/db/drizzle";

async function requireAdmin() {
  const session = await adminAuth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await db
    .select()
    .from(appointmentRequests)
    .orderBy(desc(appointmentRequests.createdAt));

  return NextResponse.json(requests);
}
