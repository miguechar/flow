import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@repo/auth/auth";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await adminAuth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
