import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, policies } from "@workspace/db"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { z } from "zod"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") return null
  return session
}

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, content } = schema.parse(body)

  const [existing] = await db
    .select()
    .from(policies)
    .where(eq(policies.isActive, true))
    .limit(1)

  if (existing) {
    await db
      .update(policies)
      .set({ title, content, updatedAt: new Date(), version: existing.version + 1 })
      .where(eq(policies.id, existing.id))
  } else {
    await db.insert(policies).values({
      id: crypto.randomUUID(),
      title,
      content,
      version: 1,
      isActive: true,
    })
  }

  return NextResponse.json({ success: true })
}
