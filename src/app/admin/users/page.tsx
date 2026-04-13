import { prisma } from "@/lib/db";
import { getInitials, formatDate } from "@/lib/utils";
import { UserPlus, Shield, Eye, Settings } from "lucide-react";
import Link from "next/link";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-sip-amber/20 text-sip-amber",
  MANAGER: "bg-sip-blue/20 text-sip-blue",
  VIEWER: "bg-sip-teal/20 text-sip-teal",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-400",
  OFFLINE: "bg-gray-500/20 text-gray-400",
  INVITED: "bg-sip-blue/20 text-sip-blue",
};

const roleDescriptions = [
  { role: "Super Admin", color: "text-sip-amber", description: "Full system access. Can manage users, settings, products, orders, and content. Can delete data." },
  { role: "Manager", color: "text-sip-blue", description: "Manage products, process orders, and edit content. Cannot manage users or system settings." },
  { role: "Viewer", color: "text-sip-teal", description: "Read-only access to dashboards, orders, and product catalogue. Cannot modify any data." },
];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const filterRole = params.role;

  const where = filterRole && filterRole !== "all"
    ? { role: filterRole.toUpperCase() as "SUPER_ADMIN" | "MANAGER" | "VIEWER" }
    : {};

  const [users, allUsers] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "asc" } }),
    prisma.user.findMany(),
  ]);

  const roleCounts: Record<string, number> = { SUPER_ADMIN: 0, MANAGER: 0, VIEWER: 0 };
  allUsers.forEach((u) => roleCounts[u.role]++);

  const tabs = [
    { label: `All Users (${allUsers.length})`, value: "all" },
    { label: `Super Admin (${roleCounts.SUPER_ADMIN})`, value: "super_admin" },
    { label: `Manager (${roleCounts.MANAGER})`, value: "manager" },
    { label: `Viewer (${roleCounts.VIEWER})`, value: "viewer" },
  ];

  const activeTab = filterRole || "all";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sip-text-muted text-sm mt-1">Manage admin accounts, roles and access permissions</p>
        </div>
        <button className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link key={tab.value} href={`/admin/users?role=${tab.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value ? "bg-sip-amber text-sip-bg-primary" : "bg-sip-card text-sip-text-secondary hover:text-white border border-sip-border-subtle"
            }`}>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-sip-card border border-sip-border-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Last Active</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-sip-border-subtle/50 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: user.avatarColor }}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-sip-text-muted text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sip-text-secondary text-sm">
                    {formatDate(user.lastActive)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[user.status]}`}>
                      {user.status === "ACTIVE" ? "Active" : user.status === "OFFLINE" ? "Offline" : "Invited"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-sip-blue text-sm hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roles & Permissions */}
        <div className="space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Roles & Permissions</h2>
            <div className="space-y-4">
              {roleDescriptions.map((role) => (
                <div key={role.role}>
                  <p className={`text-sm font-semibold ${role.color}`}>{role.role}</p>
                  <p className="text-sip-text-muted text-xs mt-1">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sip-amber mt-2" />
                  <div>
                    <p className="text-white text-xs">
                      <span className="font-medium">{user.name}</span>{" "}
                      {user.status === "INVITED" ? "was invited as Viewer" : "updated product listing"}
                    </p>
                    <p className="text-sip-text-muted text-xs">{formatDate(user.lastActive)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
