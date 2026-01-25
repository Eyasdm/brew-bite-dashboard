import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import MenuCard from "../components/MenuCard";
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
  // null → closed
  // "add" → add
  // object → edit

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
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {t("errors.loadMenuFailed")}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("menu.title")}</h1>

        <button
          onClick={() => setActiveItem("add")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t("menu.addNew")}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("menu.searchPlaceholder")}
              className="h-11 w-full rounded-xl border pl-10 pr-3 text-sm"
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
        <div className="rounded-2xl border p-10 text-center text-sm">
          {t("menu.loading")}
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
              onDelete={() => {
                if (confirm(t("menu.confirmDelete"))) {
                  deleteMutation.mutate(item.id);
                }
              }}
            />
          ))}

          {!filteredItems.length && (
            <div className="col-span-full text-center text-sm py-10">
              {t("menu.empty")}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditMenuItemModal
        open={activeItem !== null}
        mode={activeItem === "add" ? "add" : "edit"}
        initialData={activeItem !== "add" ? activeItem : null}
        loading={addMutation.isLoading || updateMutation.isLoading}
        onClose={() => setActiveItem(null)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
