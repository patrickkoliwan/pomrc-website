import type { DetailRowContent } from "../content/membership-content";

interface DetailGridProps {
  rows: DetailRowContent[];
  valueClassName?: string;
}

export default function DetailGrid({
  rows,
  valueClassName = "font-semibold text-dark-teal",
}: DetailGridProps) {
  return (
    <dl className="divide-y divide-muted-teal/20">
      {rows.map((row) => (
        <div key={row.label} className="py-3 first:pt-0 last:pb-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <dt className="text-sm text-dark-teal/80">{row.label}</dt>
            <dd className={`text-sm sm:text-right ${valueClassName}`}>
              {row.value}
            </dd>
          </div>
          {row.note && (
            <p className="mt-2 text-xs leading-relaxed text-dark-teal/60">
              {row.note}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}
