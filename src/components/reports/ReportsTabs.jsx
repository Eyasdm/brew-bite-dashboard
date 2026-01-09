export default function ReportsTabs({ value, onChange }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
    { id: "performance", label: "Performance" },
  ];

  return (
    <div className="inline-flex rounded-xl bg-muted-soft p-1 text-sm font-medium">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg transition ${
            value === tab.id
              ? "bg-card text-text shadow-sm"
              : "text-text hover:text-text font-medium"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
