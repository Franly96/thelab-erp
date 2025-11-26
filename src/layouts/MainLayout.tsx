import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { USER_TYPES, type UserProfile } from '../core/types';
import { ThemeToggle } from '../core/ThemeToggle';

type MainLayoutProps = {
  user: UserProfile | null;
  onLogout: () => void;
};

export type MainLayoutContext = {
  user: UserProfile;
};

const getInitials = (fullName: string) =>
  fullName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

function MainLayout({ user, onLogout }: MainLayoutProps) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const initials = getInitials(user.fullName);
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 lg:px-8">
        <header className="sticky top-4 z-20 rounded-2xl border border-slate-200/70 bg-white/80 shadow-lg ring-1 ring-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:ring-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-base font-extrabold text-slate-900 shadow-sm">
                LAB
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">The Lab ERP</p>
                <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">Operations Center</p>
              </div>
            </div>

              <div className="flex flex-wrap items-center gap-3">
                <ThemeToggle />
                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-base font-bold text-slate-900">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Tipo: {user.type}
                  </p>
                </div>
                <button
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  type="button"
                  onClick={onLogout}
                >
                  Cerrar sesion
                </button>
              </div>
            </div>
          </div>
        </header>

        <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-2 shadow-sm ring-1 ring-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:ring-white/5">
          <Link
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              isActive('/')
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70'
            }`}
            to="/"
          >
            Dashboard
          </Link>
          {user.type === USER_TYPES.Sysadmin ? (
            <Link
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive('/users')
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70'
              }`}
              to="/users"
            >
              Usuarios
            </Link>
          ) : (
            <span className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 ring-1 ring-slate-200/70 dark:text-slate-500 dark:ring-slate-700/70">
              Usuarios (solo sysadmin)
            </span>
          )}
        </nav>

        <main className="min-h-[60vh] rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl ring-1 ring-slate-900/5 transition dark:border-slate-800 dark:bg-slate-900/70 dark:ring-white/5 sm:p-6 lg:p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
