import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_TYPES, type UserProfile, type UserType } from '../core/types';

type LoginProps = {
  onLogin: (user: UserProfile) => void;
};

function Login({ onLogin }: LoginProps) {
  const [fullName, setFullName] = useState('SYS Admin');
  const [type, setType] = useState<UserType>(USER_TYPES.Sysadmin);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectOpen, setSelectOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? '/';
  }, [location.state]);

  const handlePickUser = (user: UserProfile) => {
    setFullName(user.fullName);
    setType(user.type);
    setPassword('');
    setSelectOpen(false);
    setError(null);
  };

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/users`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar usuarios');
        }
        const data = (await response.json()) as Array<Partial<UserProfile>>;
        if (!active) return;
        const mapped = data.map((item, index) => ({
          id: typeof item.id === 'number' ? item.id : index + 1,
          fullName: item.fullName ?? 'Sin nombre',
          type: item.type ?? USER_TYPES.Service,
          createdAt: item.createdAt ?? new Date().toISOString(),
          updatedAt: item.updatedAt ?? new Date().toISOString(),
        }));
        setUsers(mapped);
        const first = mapped[0];
        if (first) {
          setFullName(first.fullName);
          setType(first.type);
          setSelectOpen(false);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error cargando usuarios';
        setError(message);
        setSelectOpen(true);
      }
    };
    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName) {
      setSelectOpen(true);
      return;
    }
    setLoading(true);

    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales invalidas');
      }

      const data = await response.json();
      const profile: UserProfile = {
        id: data.user.id,
        fullName: data.user.fullName,
        type: data.user.type,
        createdAt: data.user.createdAt ?? new Date().toISOString(),
        updatedAt: data.user.updatedAt ?? new Date().toISOString(),
      };

      onLogin(profile);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesion';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Acceso
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inicia sesion</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Usa cualquier correo y clave para entrar al prototipo.</p>
      </div>

      <div className="space-y-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Usuario seleccionado</span>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{fullName}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-300">Tipo: {type}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setSelectOpen(true)}
          >
            Cambiar
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        <span>Clave</span>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
          disabled={!fullName}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
        />
      </label>

      {error ? <p className="text-sm font-semibold text-rose-500">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        No hay llamadas reales; esto mantiene el flujo simple para el diseno.
      </p>

      {selectOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Selecciona un usuario
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Elige a quien vas a ingresar</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Solo necesitas la clave del perfil.</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                onClick={() => setSelectOpen(false)}
              >
                Cerrar
              </button>
            </div>

            {users.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No hay usuarios disponibles. Crea uno en el backend.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60"
                    onClick={() => handlePickUser(user)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-slate-900">
                      {user.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .filter(Boolean)
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm text-slate-900 dark:text-white">{user.fullName}</strong>
                      <span className="inline-flex w-fit items-center rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                        {user.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default Login;
