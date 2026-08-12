import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import SelectMenu from "./SelectMenu";
import ToggleSwitch from "./ToggleSwitch";
import Portal from "./Portal";
import type { Profile, CreateUserPayload, UpdateUserPayload } from "../types";

/* ---------------- styles ---------------- */
const INPUT_CLASS =
  "h-[44px] w-full rounded-xl border border-border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed";

interface UserFormData {
  full_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

const EMPTY_FORM: UserFormData = {
  full_name: "",
  email: "",
  password: "",
  role: "staff",
  is_active: true,
};

function mapUserToForm(user: Profile | null | undefined): UserFormData {
  return {
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "staff",
    is_active: user?.is_active ?? true,
  };
}

/* ================= Wrapper ================= */
interface AddEditUserModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: Profile | null;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  loading: boolean;
}

export default function AddEditUserModal({
  open,
  mode = "add",
  initialData,
  onClose,
  onSubmit,
  loading,
}: AddEditUserModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  const formKey =
    mode === "edit" && initialData ? `edit-${initialData.id}` : "add";

  return (
    <Portal>
      <FormContent
        key={formKey}
        mode={mode}
        initialData={initialData}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={loading}
        t={t}
      />
    </Portal>
  );
}

/* ================= Inner Form ================= */
interface FormContentProps {
  mode: "add" | "edit";
  initialData?: Profile | null;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  loading: boolean;
  t: TFunction;
}

function FormContent({ mode, initialData, onClose, onSubmit, loading, t }: FormContentProps) {
  const [form, setForm] = useState<UserFormData>(() =>
    mode === "edit" && initialData ? mapUserToForm(initialData) : EMPTY_FORM,
  );

  const roleOptions = useMemo(
    () => [
      { value: "admin", label: t("users.roles.admin") },
      { value: "staff", label: t("users.roles.staff") },
    ],
    [t],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const payload: CreateUserPayload | UpdateUserPayload =
      mode === "add"
        ? form
        : {
            role: form.role,
            is_active: form.is_active,
          };

    onSubmit(payload);
  }

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-[520px] rounded-2xl bg-card px-8 py-6 shadow-xl">
        {/* header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {isEdit ? t("user.edit.title") : t("user.create.title")}
          </h2>

          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name */}
          <Field label={t("user.fields.name")} required>
            <input
              value={form.full_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, full_name: e.target.value }))
              }
              className={INPUT_CLASS}
              required
            />
          </Field>

          {/* email */}
          <Field label={t("user.fields.email")} required>
            <input
              type="email"
              value={form.email}
              disabled={isEdit}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className={INPUT_CLASS}
              required
            />
          </Field>

          {/* password (add only) */}
          {!isEdit && (
            <Field label={t("user.fields.password")} required>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </Field>
          )}

          {/* role */}
          <Field label={t("user.fields.role")} required>
            <SelectMenu
              value={form.role}
              onChange={(v: string) => setForm((p) => ({ ...p, role: v }))}
              options={roleOptions}
            />
          </Field>

          {/* status */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium">
              {t("user.fields.status")}
            </span>

            <ToggleSwitch
              checked={form.is_active}
              onChange={(v: boolean) => setForm((p) => ({ ...p, is_active: v }))}
              label={
                form.is_active
                  ? t("user.fields.active")
                  : t("user.fields.inactive")
              }
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-3 h-[44px] w-full rounded-xl text-sm font-medium text-white ${
              loading
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isEdit ? t("user.edit.submit") : t("user.create.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= Field ================= */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
