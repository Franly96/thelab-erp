import { Navigate, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../core/ThemeToggle';

type AuthLayoutProps = {
  isAuthenticated: boolean;
};

function AuthLayout({ isAuthenticated }: AuthLayoutProps) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-900 text-slate-100 shadow-2xl ring-1 ring-slate-900/30 dark:border-slate-800 dark:bg-slate-950">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <div className="relative flex h-full flex-col justify-center gap-5 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 px-6 py-8 sm:px-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              The Lab ERP
            </div>
            <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
              Donde el equipo
              <br />
              coordina sin fricciones.
            </h1>
            <p className="max-w-xl text-lg text-slate-200">
              Conecta operaciones, personas y datos en un solo lugar para avanzar mas rapido y con
              visibilidad en tiempo real.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Dashboard vivo', 'Roles y permisos', 'Alertas en minutos'].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 backdrop-blur"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-xl ring-1 ring-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:ring-white/5 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
