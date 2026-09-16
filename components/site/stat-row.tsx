/**
 * Shared 3-column stat row (value over label, divided by faint vertical
 * rules) — used on the offerings grid, the deal detail stub, and any future
 * dashboard/spotlight card, per spec: "do not fork three separate stat-row
 * implementations."
 */
export function StatRow({
  items,
}: {
  items: { value: string; label: string; icon?: React.ReactNode }[];
}) {
  return (
    <div className="grid border-t border-hairline pt-4 text-center" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item, i) => (
        <div key={item.label} className={i < items.length - 1 ? "border-r border-hairline px-1" : "px-1"}>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
            {item.icon && <span className="text-brand shrink-0">{item.icon}</span>}
            <p className="text-[0.88rem] sm:text-[0.95rem] text-ink" style={{ fontWeight: 800 }}>
              {item.value}
            </p>
          </div>
          <p className="mt-1 text-[0.72rem] sm:text-[0.78rem] text-muted-foreground truncate" title={item.label}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
