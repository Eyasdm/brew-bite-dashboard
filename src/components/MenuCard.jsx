import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MenuCard({ item, onToggle, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-40 w-full">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className={`h-full w-full object-cover ${
            item.sub_category === "iced-coffee" ? "object-top" : "object-center"
          }
          transition-transform duration-300
          group-hover:scale-105`}
        />

        {item.is_available && (
          <span className="absolute top-3 right-3 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            {t("menu.availability.available")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text">{item.name}</h3>
          <span className="text-sm font-semibold text-primary">
            ${item.price}
          </span>
        </div>

        <p className="text-xs text-text-muted line-clamp-2">
          {item.description}
        </p>

        <div className="text-xs text-text-muted capitalize">
          {item.category}
          {item.sub_category ? ` • ${item.sub_category}` : ""}
        </div>

        {/* Toggle + Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onToggle(item)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition
                ${
                  item.is_available
                    ? "bg-primary"
                    : "bg-muted border border-border"
                }`}
              aria-label={t("menu.toggleAvailability")}
              title={t("menu.toggleAvailability")}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${item.is_available ? "translate-x-4" : "translate-x-1"}`}
              />
            </button>

            <span className="text-text">
              {item.is_available
                ? t("menu.availability.available")
                : t("menu.availability.unavailable")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(item)}
              className="h-9 w-9 grid place-items-center rounded-xl border border-border hover:bg-muted"
              aria-label={t("common.edit")}
              title={t("common.edit")}
            >
              <Pencil className="h-4 w-4 text-text-muted" />
            </button>

            <button
              onClick={() => onDelete?.(item)}
              className="h-9 w-9 grid place-items-center rounded-xl border border-border hover:bg-red-50"
              aria-label={t("common.delete")}
              title={t("common.delete")}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
