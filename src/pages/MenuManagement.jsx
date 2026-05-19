import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import MenuCard from "../components/MenuCard";
import { MenuCardSkeleton } from "../components/MenuCardSkeleton";
import SelectMenu from "../components/SelectMenu";
import AddEditMenuItemModal from "../components/AddEditMenuItemModal";

import { useMenuItems } from "../hooks/useMenuItems";
import { useToggleMenuAvailability } from "../hooks/useToggleMenuAvailability";
import { useAddDrink } from "../hooks/useAddDrink";
import { useDeleteMenuItem } from "../hooks/useDeleteMenuItem";
import { useUpdateMenuItem } from "../hooks/useUpdateMenuItem";

import {
  getAvailabiityOptions,
  getCategoryOptions,
} from "../constants/menu.constants";

export default function MenuManagement() {
  const { t } = useTranslation();

  /* ------------------ data ------------------ */
  const { data: items = [], isLoading, error } = useMenuItems();

  const toggleMutation = useToggleMenuAvailability();
  const addMutation = useAddDrink();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  /* ------------------ UI state ------------------ */
  const [activeItem, setActiveItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");

  /* ------------------ options ------------------ */
  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);
  const availabilityOptions = useMemo(() => getAvailabiityOptions(t), [t]);

  /* ------------------ filtering ------------------ */
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const matchCategory = category === "all" || item.category === category;

      const matchAvailability =
        availability === "all" ||
        (availability === "available" && item.is_available) ||
        (availability === "unavailable" && !item.is_available);

      return matchSearch && matchCategory && matchAvailability;
    });
  }, [items, search, category, availability]);

  /* ------------------ submit handler ------------------ */
  function handleSubmit(data, resetForm) {
    if (activeItem === "add") {
      addMutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          setActiveItem(null);
        },
      });
      return;
    }

    updateMutation.mutate(
      { id: activeItem.id, payload: data },
      { onSuccess: () => setActiveItem(null) },
    );
  }

  /* ------------------ render ------------------ */
  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="rounded-xl bg-danger-soft p-3 text-sm text-danger">
          {t("errors.loadMenuFailed")}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">{t("menu.title")}</h1>

        <button
          onClick={() => setActiveItem("add")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          {t("menu.addNew")}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-border bg-bg pl-10 pr-3 text-sm text-text outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <SelectMenu
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />

          <SelectMenu
            value={availability}
            onChange={setAvailability}
            options={availabilityOptions}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onToggle={() =>
                toggleMutation.mutate({
                  id: item.id,
                  next: !item.is_available,
                })
              }
              onEdit={() => setActiveItem(item)}
              onDelete={() => setDeletingItem(item)}
            />
          ))}

          {!filteredItems.length && (
            <div className="col-span-full text-center text-sm text-text-muted py-10">
              {t("menu.empty")}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-base font-semibold text-text mb-2">
              {t("menu.confirmDeleteTitle")}
            </h2>
            <p className="text-sm text-text-muted mb-6">
              {t("menu.confirmDeleteDesc", { name: deletingItem.name })}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="flex-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMutation.mutate(deletingItem.id);
                  setDeletingItem(null);
                }}
                className="flex-1 rounded-xl bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditMenuItemModal
        open={activeItem !== null}
        mode={activeItem === "add" ? "add" : "edit"}
        initialData={activeItem !== "add" ? activeItem : null}
        loading={addMutation.isPending || updateMutation.isPending}
        onClose={() => setActiveItem(null)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
