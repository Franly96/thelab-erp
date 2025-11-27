import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { USER_TYPES, type UserProfile } from '../core/types';
import { ThemeToggle } from '../core/ThemeToggle';
import { appMeta } from '../content/appMeta';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const initials = getInitials(user.fullName);
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  const canSeeProducts =
    user.type === USER_TYPES.Sysadmin ||
    user.type === USER_TYPES.Admin ||
    user.type === USER_TYPES.Manager;
  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    ...(canSeeProducts ? [{ label: 'Productos', path: '/products', icon: '📦' }] : []),
    ...(user.type === USER_TYPES.Sysadmin ? [{ label: 'Usuarios', path: '/users', icon: '👥' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <div className="flex min-h-screen">
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/10 bg-slate-900 text-slate-100 shadow-2xl transition-transform duration-200 dark:border-slate-800/50 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-base font-bold text-slate-900 shadow-sm">
                {appMeta.name.slice(0, 3).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-200">{appMeta.name}</p>
                <p className="text-xs text-slate-400">{appMeta.description}</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive(item.path)
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon ?? '📊'}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-800/50 px-4 py-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-3 py-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-slate-900">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                <p className="text-xs uppercase text-slate-300">Tipo: {user.type}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 px-4 py-3 text-white shadow-lg dark:border-slate-800/50">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menu"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Panel</p>
                  <p className="text-lg font-bold leading-tight">{appMeta.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="flex items-center gap-3 rounded-xl bg-white/15 px-3 py-2 shadow-sm backdrop-blur">
                  <span className="hidden text-sm font-semibold text-white/80 sm:inline">Hola, {user.fullName}</span>
                  <button
                    className="rounded-lg border border-white/30 px-3 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                    type="button"
                    onClick={onLogout}
                  >
                    Cerrar sesion
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet context={{ user }} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
