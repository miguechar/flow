import { createAuth } from "@workspace/auth"

export const auth = createAuth({
  baseURL: process.env["BETTER_AUTH_URL"] ?? "http://localhost:3001",
  emailAndPassword: { enabled: true },
})

export type Auth = typeof auth
