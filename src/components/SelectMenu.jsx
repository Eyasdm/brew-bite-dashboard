import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectMenu({
  value,
  onChange,
  options,
  className = "",
  align = "right", // "right" | "left"
  minWidth = 180,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = options.find((o) => o.value === value) ?? options[0];

  // close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={ref} className={cx("relative", className)} style={{ minWidth }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-11 w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-bg px-3 text-sm text-text hover:bg-muted transition"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown
          className={cx(
            "h-4 w-4 text-text-muted transition",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Menu */}
      {open && (
        <div
          className={cx(
            "absolute z-20 mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((opt) => {
            const active = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted transition",
                  active && "bg-muted"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
