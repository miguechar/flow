"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    // BetterAuth handles the magic link verification automatically via the API route.
    // This page is shown after the redirect. Check for error param.
    const error = searchParams.get("error");
    if (error) {
      setStatus("error");
    } else {
      // Verification succeeded — redirect to book page after brief delay
      setStatus("success");
      const t = setTimeout(() => router.push("/book"), 1500);
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4">
      <div className="text-center max-w-sm space-y-4">
        {status === "loading" && (
          <>
            <Loader2Icon className="size-12 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">Verifying your link...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircleIcon className="size-9 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">You&apos;re signed in!</h2>
            <p className="text-muted-foreground">
              Redirecting you to your booking...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircleIcon className="size-9 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Link expired or invalid</h2>
            <p className="text-muted-foreground text-sm">
              Magic links expire after 15 minutes. Please request a new one.
            </p>
            <Link href="/auth/sign-in">
              <Button className="mt-2">Request a New Link</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
