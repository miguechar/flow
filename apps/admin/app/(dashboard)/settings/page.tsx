import { db } from "@repo/db/db";
import { policies } from "@repo/db/schema";
import { eq } from "@repo/db/drizzle";
import { PolicyEditor } from "./policy-editor";

export default async function SettingsPage() {
  const [policy] = await db
    .select()
    .from(policies)
    .where(eq(policies.isActive, true))
    .limit(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your clinic policy and preferences.
        </p>
      </div>

      <div className="max-w-2xl">
        <PolicyEditor initialPolicy={policy ?? null} />
      </div>
    </div>
  );
}
