import { useMemo } from 'react';
import { useTheme } from './theme';

function Icon({ name }: { name: 'sun' | 'moon' }) {
  if (name === 'sun') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364-1.414 1.414M6.05 17.95l-1.414 1.414m0-13.414L6.05 6.05m11.314 11.314 1.414 1.414" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const label = useMemo(() => (theme === 'light' ? 'Modo claro' : 'Modo oscuro'), [theme]);
  const icon = theme === 'light' ? 'sun' : 'moon';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
    >
      <span className="rounded-full bg-slate-100 p-1 text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-50">
        <Icon name={icon} />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
