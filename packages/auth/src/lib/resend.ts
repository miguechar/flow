import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("❌ Missing RESEND_API_KEY at runtime.");
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }
  return new Resend(key);
}
