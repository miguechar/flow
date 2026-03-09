"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { LeafIcon, Loader2Icon } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const toastId = useId();
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      toast.loading("Signing in...", { id: toastId });

      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if ((data?.user as { role?: string } | undefined)?.role !== "admin") {
        toast.error("Access denied.", { id: toastId });
        return;
      }
      toast.dismiss(toastId);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <LeafIcon className="size-6 text-primary" />
            Flow Massage
          </div>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Admin Sign In</CardTitle>
            <CardDescription>
              Sign in to manage appointments and clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
