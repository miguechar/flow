import { NextRequest, NextResponse } from "next/server";
import { adminAuth, webAuth } from "@repo/auth/auth";
import { appointmentRequests } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { eq } from "@repo/db/drizzle";
import { headers } from "next/headers";
import { z } from "zod";
import { getResend } from "@repo/auth/resend";

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

  if (data.status === "approved") {
    /**
     * Create an account for a client and send them a link to sign in.
     * From there, they will choose to sign in with they magic link
     */

    await webAuth.api.signUpEmail({
      body: {
        email: request.email as string,
        password: crypto.randomUUID(),
        name: request.name as string,
      },
    });

    const resend = getResend();
    const promise = resend.emails.send({
      from: "Charry With an A <admin@charrywithana.com>",
      to: request.email as string,
      subject: "Welcome to Charry With an A",
      text: `Welcome to Charry With an A! Click the link to sign in`,
    });
    if (request) {
      (request as any).waitUntil?.(promise);
    } else {
      void promise;
    }
  }

  return NextResponse.json({ success: true });
}
