import type { MainLayoutContext } from '../../layouts/MainLayout';

type DashboardHeaderProps = {
  user: MainLayoutContext['user'];
  greeting: string;
};

function DashboardHeader({ user, greeting }: DashboardHeaderProps) {
  const firstName = user.fullName.split(' ')[0] ?? user.fullName;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Dashboard
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {greeting}, {firstName}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Enlaces rapidos hacia tus modulos clave para operar el dia a dia.
        </p>
      </div>
      <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold uppercase text-sky-800 shadow-sm dark:border-sky-900/60 dark:bg-sky-900/40 dark:text-sky-100">
        {user.type}
      </div>
    </div>
  );
}

export default DashboardHeader;
