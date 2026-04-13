import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = {
    name: session.user.name || "Admin",
    email: session.user.email || "",
    role: (session.user as Record<string, unknown>).role as string || "VIEWER",
    avatarColor: (session.user as Record<string, unknown>).avatarColor as string || "#F59E0B",
  };

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen bg-sip-bg-primary overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
