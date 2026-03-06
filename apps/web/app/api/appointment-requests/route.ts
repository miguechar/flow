import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db/db";
import { appointmentRequests } from "@repo/db/schema";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  serviceType: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = requestSchema.parse(body);

    const id = crypto.randomUUID();
    await db.insert(appointmentRequests).values({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceType: data.serviceType,
      message: data.message ?? null,
      status: "pending",
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
