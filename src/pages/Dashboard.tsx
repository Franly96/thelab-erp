import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { MainLayoutContext } from '../layouts/MainLayout';

const activity = [
  { title: 'Ordenes en curso', value: 18, trend: '+3 hoy' },
  { title: 'Equipos activos', value: 7, trend: 'Sin demoras' },
  { title: 'Alertas', value: 2, trend: 'Revision en proceso' },
];

function Dashboard() {
  const { user } = useOutletContext<MainLayoutContext>();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Resumen
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting}, {user.fullName.split(' ')[0]}
          </h2>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Esto es un punto de partida, conecta tus modulos para ver datos reales.
          </p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold uppercase text-sky-800 shadow-sm dark:border-sky-900/60 dark:bg-sky-900/40 dark:text-sky-100">
          {user.type}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activity.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.title}</p>
            <strong className="mt-2 block text-3xl font-bold text-slate-900 dark:text-white">{item.value}</strong>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{item.trend}</span>
          </div>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tu equipo esta en linea</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Usa este layout como base para agregar graficos, tablas o flujos de trabajo. Mantiene la informacion clave
            visible y accesible.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Estado de autenticacion</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            El usuario se valida antes de mostrar contenido protegido.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
