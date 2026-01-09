import { useMemo, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Search,
  Shield,
  UserX,
  CheckCircle2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import StatCard from "../components/StatCard";
import AddEditUserModal from "../components/AddEditUserModal";

import { useUsers } from "../hooks/useUsers";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDeleteUser } from "../hooks/useDeleteUser";

import { formatDate } from "../utils/formaters";

/* ================= helpers ================= */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ tone = "gray", children }) {
  const tones = {
    gray: "bg-muted text-text",
    green: "bg-green-100 text-green-800 border border-green-200",
    red: "bg-red-100 text-red-800 border border-red-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone] ?? tones.gray
      )}
    >
      {children}
    </span>
  );
}

/* ================= badge mappers ================= */
function roleBadge(role, t) {
  if (role === "admin") {
    return { tone: "purple", label: t("users.roles.admin") };
  }
  return { tone: "blue", label: t("users.roles.staff") };
}

function statusBadge(isActive, t) {
  if (isActive) {
    return { tone: "green", label: t("users.status.active") };
  }
  return { tone: "red", label: t("users.status.inactive") };
}

/* ================= component ================= */
export default function UserManagement() {
  const { t } = useTranslation();

  // queries & mutations
  const { data: users = [], error } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  // UI state
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* ---------- filtering ---------- */
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.is_active).length,
      inactive: users.filter((u) => !u.is_active).length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* ================= header ================= */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{t("users.title")}</h1>
          <p className="mt-1 text-sm text-text-muted">{t("users.subtitle")}</p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          {t("users.createuser")}
        </button>
      </div>

      {/* ================= error ================= */}
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {t("errors.loadUsersFailed")}
        </div>
      )}

      {/* ================= stats ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("users.stats.total")}
          value={stats.total}
          icon={User}
        />
        <StatCard
          title={t("users.stats.admins")}
          value={stats.admins}
          icon={Shield}
        />
        <StatCard
          title={t("users.stats.active")}
          value={stats.active}
          icon={CheckCircle2}
        />
        <StatCard
          title={t("users.stats.inactive")}
          value={stats.inactive}
          icon={UserX}
        />
      </div>

      {/* ================= search ================= */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="flex h-11 items-center gap-2 rounded-xl border px-3">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("users.search")}
            className="h-full w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* ================= table ================= */}
      <section className="rounded-2xl border bg-card">
        <div className="border-b px-4 py-4 text-sm font-medium">
          {t("users.tableTitle")} ({filteredUsers.length})
        </div>

        <table className="w-full min-w-[900px]">
          <tbody className="divide-y">
            {filteredUsers.map((u) => {
              const role = roleBadge(u.role, t);
              const status = statusBadge(u.is_active, t);

              return (
                <tr key={u.id} className="text-sm">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.full_name}</div>
                    <div className="text-xs text-text-muted">{u.email}</div>
                  </td>

                  <td className="px-4 py-3 text-text-muted">
                    {formatDate(u.created_at)}
                  </td>

                  <td className="px-4 py-3">
                    <Badge tone={role.tone}>{role.label}</Badge>
                  </td>

                  <td className="px-4 py-3">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </td>

                  {/* ===== actions ===== */}
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === u.id ? null : u.id)
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === u.id && (
                      <div className="absolute right-4 top-12 z-20 w-32 rounded-xl border bg-white shadow">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setOpenMenuId(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                        >
                          {t("common.edit")}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(t("user.confirmDelete"))) {
                              deleteMutation.mutate(u.id);
                            }
                            setOpenMenuId(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* ================= modals ================= */}
      <AddEditUserModal
        open={openAdd}
        mode="add"
        loading={createMutation.isLoading}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: () => setOpenAdd(false),
          })
        }
      />

      <AddEditUserModal
        open={!!editingUser}
        mode="edit"
        initialData={editingUser}
        loading={updateMutation.isLoading}
        onClose={() => setEditingUser(null)}
        onSubmit={(data) =>
          updateMutation.mutate(
            { id: editingUser.id, payload: data },
            { onSuccess: () => setEditingUser(null) }
          )
        }
      />
    </div>
  );
}
