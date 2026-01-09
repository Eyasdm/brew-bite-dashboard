function StatCard({ title, icon: Icon, value, iconClassName }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
        </div>

        <div
          className={`h-10 w-10 rounded-xl grid place-items-center ${iconClassName} `}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
