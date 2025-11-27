export type ChartCardProps = {
  title: string;
  periodLabel: string;
  description: string;
};

function ChartCard({ title, periodLabel, description }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {periodLabel}
        </span>
      </div>
      <div className="grid min-h-[220px] place-items-center rounded-xl bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 text-center text-sm text-slate-600 dark:from-emerald-400/15 dark:to-slate-900 dark:text-slate-300">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ChartCard;
