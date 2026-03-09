import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@repo/db/db";
import * as schema from "@repo/db/schema";
import { getResend } from "./lib/resend";

const sharedConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env["BETTER_AUTH_SECRET"]!,
  user: {
    additionalFields: {
      role: {
        type: "string" as const,
        defaultValue: "client",
        required: false,
        input: false,
      },
    },
  },
};

export const webAuth = betterAuth({
  ...sharedConfig,
  baseURL: process.env["BETTER_AUTH_URL"] ?? "http://localhost:3000",
  emailAndPassword: { enabled: true },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token }, request) => {
        const resend = getResend();

        const promise = resend.emails.send({
          from: "Charry With an A <admin@charrywithana.com>",
          to: email,
          subject: "Magic",
          text: `Click the link to Magic: ${process.env.BETTER_AUTH_WEB_URL}/api/auth/magic-link?token=${token}/book`,
        });

        if (request) {
          (request as any).waitUntil?.(promise);
        } else {
          void promise;
        }
      },
    }),
  ],
});

export const adminAuth = betterAuth({
  ...sharedConfig,
  baseURL: process.env["ADMIN_AUTH_URL"] ?? "http://localhost:3001",
  emailAndPassword: { enabled: true },
});
