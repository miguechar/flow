"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import type { Policy } from "@repo/db/schema";

export function PolicyEditor({
  initialPolicy,
}: {
  initialPolicy: Policy | null;
}) {
  const [title, setTitle] = useState(initialPolicy?.title ?? "Clinic Policy");
  const [content, setContent] = useState(initialPolicy?.content ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Policy saved successfully.");
    } catch {
      toast.error("Failed to save policy. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinic Policy</CardTitle>
        <CardDescription>
          This policy is shown to clients before they book. They must agree to
          it before completing their booking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Policy Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Policy Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Enter your clinic policy here..."
          />
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          Save Policy
        </Button>
      </CardContent>
    </Card>
  );
}
