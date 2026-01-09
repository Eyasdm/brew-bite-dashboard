import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Portal from "./Portal";
import SelectMenu from "./SelectMenu";
import ToggleSwitch from "./ToggleSwitch";
import { getAddDrinkCategoryOptions } from "../constants/menu.constants";

/* ------------------ styles ------------------ */
const INPUT_CLASS =
  "h-[44px] w-full rounded-xl border border-border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

/* ------------------ helpers ------------------ */
const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  available: true,
};

function mapItemToForm(item) {
  return {
    name: item?.name ?? "",
    price: item?.price ?? "",
    category: item?.category ?? "",
    image: item?.image_url ?? "",
    description: item?.description ?? "",
    available: item?.is_available ?? true,
  };
}

/* ------------------ component ------------------ */
export default function AddEditMenuItemModal({
  open,
  mode = "add", // "add" | "edit"
  initialData,
  onClose,
  onSubmit,
  loading,
}) {
  const { t } = useTranslation();

  // 🔑 key controls remount (important)
  const formKey = mode === "edit" && initialData ? initialData.id : "add";

  const [form, setForm] = useState(() =>
    mode === "edit" && initialData ? mapItemToForm(initialData) : EMPTY_FORM
  );

  const categoryOptions = useMemo(() => getAddDrinkCategoryOptions(t), [t]);

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    onSubmit(
      {
        ...form,
        price: Number(form.price),
      },
      resetForm
    );
  }

  if (!open) return null;

  return (
    <Portal>
      <div
        key={formKey}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-[560px] rounded-2xl bg-white px-8 py-6 shadow-xl">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {mode === "add"
                ? t("menu.addDrink.title")
                : t("menu.editItem.title")}
            </h2>

            <button onClick={onClose} aria-label={t("common.close")}>
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={t("menu.addDrink.name")} required>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </Field>

            <Field label={t("menu.addDrink.price")} required>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                className={INPUT_CLASS}
                required
              />
            </Field>

            <Field label={t("menu.addDrink.category")} required>
              <SelectMenu
                value={form.category}
                onChange={(value) =>
                  setForm((p) => ({ ...p, category: value }))
                }
                options={categoryOptions}
              />
            </Field>

            <Field label={t("menu.addDrink.image")}>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
                className={INPUT_CLASS}
              />
            </Field>

            <Field label={t("menu.addDrink.description")}>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>

            {/* Available */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium">
                {t("menu.addDrink.available")}
              </span>

              <ToggleSwitch
                checked={form.available}
                onChange={(val) => setForm((p) => ({ ...p, available: val }))}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-3 h-[44px] w-full rounded-xl text-sm font-medium text-white ${
                loading
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {mode === "add"
                ? t("menu.addDrink.submit")
                : t("menu.editItem.submit")}
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}

/* ------------------ Field ------------------ */
function Field({ label, required, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-text">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
