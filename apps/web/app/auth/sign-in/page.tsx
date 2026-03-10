"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LeafIcon, Loader2Icon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { authClient } from "@repo/auth/auth-client";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? ("/book" as string);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: callbackUrl,
      });
      setSent(true);
    } catch {
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
          <MailIcon className="size-7 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Check your inbox</h2>
          <p className="text-muted-foreground text-sm">
            We sent a sign-in link to <strong>{email}</strong>. Click it
            to access your booking.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setSent(false)}
          >
            try again
          </button>
          .
        </p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a magic link to sign
          in instantly. No password needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <LeafIcon className="size-6 text-primary" />
            Flow Massage
          </div>
        </div>

        <Card>
          <Suspense>
            <SignInForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
