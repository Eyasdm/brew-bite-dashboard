import { useMemo, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Search,
  Shield,
  UserX,
  CheckCircle2,
  User,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import StatCard from "../components/StatCard";
import AddEditUserModal from "../components/AddEditUserModal";
import Spinner from "../components/Spinner";

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
  const toneClass = {
    gray: "badge-gray",
    green: "badge-green",
    red: "badge-red",
    purple: "badge-purple",
    blue: "badge-blue",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass[tone] ?? "badge-gray",
      )}
    >
      {children}
    </span>
  );
}

/* ================= Delete Confirm Modal ================= */
function DeleteConfirmModal({ user, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-danger-soft grid place-items-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold">
              {t("user.confirmDeleteTitle")}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              {t("user.confirmDeleteDesc", { name: user.full_name })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? t("common.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= Table Skeleton ================= */
function UserTableSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-border">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-36 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
          </div>
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-xl bg-muted ml-auto" />
        </div>
      ))}
    </div>
  );
}

/* ================= badge mappers ================= */
function getRoleBadge(role, t) {
  return role === "admin"
    ? { tone: "purple", label: t("users.roles.admin") }
    : { tone: "blue", label: t("users.roles.staff") };
}

function getStatusBadge(isActive, t) {
  return isActive
    ? { tone: "green", label: t("users.status.active") }
    : { tone: "red", label: t("users.status.inactive") };
}

/* ================= component ================= */
export default function UserManagement() {
  const { t } = useTranslation();

  /* ------------------ data ------------------ */
  const { data: users = [], isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  /* ------------------ UI state ------------------ */
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* ------------------ filtering ------------------ */
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, search]);

  /* ------------------ stats ------------------ */
  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.is_active).length,
      inactive: users.filter((u) => !u.is_active).length,
    };
  }, [users]);

  /* ------------------ handlers ------------------ */
  function handleDeleteConfirm() {
    if (!deletingUser) return;
    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  }

  /* =====================================================
   * Render
   * =================================================== */
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
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
      </header>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {t("errors.loadUsersFailed")}
        </div>
      )}

      {/* Stats */}
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

      {/* Search */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex h-11 items-center gap-2 rounded-xl border border-border px-3">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("users.search")}
            className="h-full w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-4 py-4 text-sm font-medium">
          {t("users.tableTitle")} ({filteredUsers.length})
        </div>

        {/* Fixed: overflow-x-auto wrapper for tablet screens */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <UserTableSkeleton />
          ) : (
            <table className="w-full min-w-[900px]">
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => {
                  const role = getRoleBadge(u.role, t);
                  const status = getStatusBadge(u.is_active, t);

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

                      {/* Actions */}
                      <td className="relative px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === u.id ? null : u.id)
                          }
                          aria-label={t("common.openMenu")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openMenuId === u.id && (
                          <div className="absolute right-4 top-12 z-20 w-32 rounded-xl border border-border bg-card shadow">
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
                                setDeletingUser(u);
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
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        user={deletingUser}
        loading={deleteUser.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingUser(null)}
      />

      {/* Add / Edit Modals */}
      <AddEditUserModal
        open={openAdd}
        mode="add"
        loading={createUser.isPending}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) =>
          createUser.mutate(data, {
            onSuccess: () => setOpenAdd(false),
          })
        }
      />

      <AddEditUserModal
        open={!!editingUser}
        mode="edit"
        initialData={editingUser}
        loading={updateUser.isPending}
        onClose={() => setEditingUser(null)}
        onSubmit={(data) =>
          updateUser.mutate(
            { id: editingUser.id, payload: data },
            { onSuccess: () => setEditingUser(null) },
          )
        }
      />
    </div>
  );
}
