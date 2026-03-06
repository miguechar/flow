import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@repo/auth/auth";
import { appointmentRequests } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { eq } from "@repo/db/drizzle";
import { headers } from "next/headers";
import { z } from "zod";

async function requireAdmin() {
  const session = await adminAuth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

const updateSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const [request] = await db
    .select()
    .from(appointmentRequests)
    .where(eq(appointmentRequests.id, id))
    .limit(1);

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .update(appointmentRequests)
    .set({
      status: data.status,
      notes: data.notes ?? request.notes,
      updatedAt: new Date(),
    })
    .where(eq(appointmentRequests.id, id));

  // If approved, send a magic link to the client
  if (data.status === "approved") {
    // Use BetterAuth's magic link to send the client their booking link
    // In production: integrate with your email provider
    console.log(
      `[Admin] Approved request for ${request.email}. ` +
        `Send magic link: POST /api/auth/magic-link with email=${request.email}`,
    );

    // Trigger the magic link for the client via BetterAuth internal call
    try {
      await fetch(
        `${process.env["NEXT_PUBLIC_WEB_URL"] ?? "http://localhost:3000"}/api/auth/magic-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: request.email,
            callbackURL: "/book",
          }),
        },
      );
    } catch {
      // Non-fatal — log and continue
      console.error("Failed to send magic link to client");
    }
  }

  return NextResponse.json({ success: true });
}
