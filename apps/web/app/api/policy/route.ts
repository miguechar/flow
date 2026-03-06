import { NextResponse } from "next/server";
import { policies } from "@repo/db/schema";
import { db } from "@repo/db/db";
import { eq } from "@repo/db/drizzle";

export async function GET() {
  try {
    const [policy] = await db
      .select()
      .from(policies)
      .where(eq(policies.isActive, true))
      .limit(1);

    if (!policy) {
      // Return a default policy if none in DB
      return NextResponse.json({
        id: "default",
        title: "Clinic Policy",
        content: DEFAULT_POLICY,
        version: 1,
      });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const DEFAULT_POLICY = `
**Cancellation Policy**
We require at least 24 hours notice to cancel or reschedule your appointment. Cancellations made with less than 24 hours notice will be charged 50% of the service fee.

**Late Arrivals**
If you arrive late, your session will be shortened to avoid inconveniencing the next client. You will be charged for the full session.

**Health & Safety**
Please inform your therapist of any health conditions, injuries, allergies, or areas of sensitivity before your session begins. Massage therapy is contraindicated for certain conditions.

**Payment**
Payment information is securely stored via Stripe. Your card will be charged after your session is complete. We accept all major credit cards.

**Privacy**
Your personal and health information is kept strictly confidential and will never be shared without your written consent.

**Conduct**
We reserve the right to end any session and charge in full if a client behaves inappropriately. Sexual misconduct will result in immediate termination of the session and will be reported to authorities.

By booking an appointment, you agree to all of the above policies.
`.trim();
