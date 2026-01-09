export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${checked ? "bg-primary" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>

      {label && <span className="text-sm text-text">{label}</span>}
    </div>
  );
}
