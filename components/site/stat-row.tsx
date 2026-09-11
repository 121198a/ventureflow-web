/**
 * Shared 3-column stat row (value over label, divided by faint vertical
 * rules) — used on the offerings grid, the deal detail stub, and any future
 * dashboard/spotlight card, per spec: "do not fork three separate stat-row
 * implementations."
 */
export function StatRow({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid border-t border-hairline pt-4 text-center" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item, i) => (
        <div key={item.label} className={i < items.length - 1 ? "border-r border-hairline px-1" : "px-1"}>
          <p className="text-[0.95rem] text-ink" style={{ fontWeight: 800 }}>
            {item.value}
          </p>
          <p className="mt-1 text-[0.78rem] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
