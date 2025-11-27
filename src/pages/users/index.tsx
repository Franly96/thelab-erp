import { useEffect, useMemo, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import UserForm, { type UserFormValues } from '../../components/users/UserForm';
import UserTable from '../../components/users/UserTable';
import { USER_TYPES, type User, type UserType } from '../../core/types';
import type { MainLayoutContext } from '../../layouts/MainLayout';

type ApiUser = User & { userType?: UserType; updatedAt: string; createdAt: string };

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const normalizeUser = (user: ApiUser): User => ({
  id: user.id,
  fullName: user.fullName,
  type: user.type ?? user.userType ?? USER_TYPES.Service,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

function UsersPage() {
  const { user } = useOutletContext<MainLayoutContext>();
  const isSysadmin = user.type === USER_TYPES.Sysadmin;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiUrl}/users`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los usuarios');
        }
        const data = (await response.json()) as ApiUser[];
        setUsers(data.map(normalizeUser));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado al cargar usuarios';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (isSysadmin) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      load();
    }
  }, [isSysadmin]);

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    setError(null);
    const payload = {
      fullName: values.fullName,
      userType: values.type,
      ...(values.password ? { password: values.password } : {}),
    };

    try {
      if (editing) {
        const response = await fetch(`${apiUrl}/users/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('No se pudo actualizar el usuario');
        }
        const data = (await response.json()) as ApiUser;
        setUsers((prev) => prev.map((item) => (item.id === data.id ? normalizeUser(data) : item)));
        setEditing(null);
      } else {
        const response = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('No se pudo crear el usuario');
        }
        const data = (await response.json()) as ApiUser;
        setUsers((prev) => [normalizeUser(data), ...prev]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error procesando la solicitud';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('¿Eliminar este usuario?');
    if (!confirmed) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/users/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario');
      }
      setUsers((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error eliminando usuario';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formInitialValues = useMemo(
    () =>
      editing
        ? {
            fullName: editing.fullName,
            type: editing.type,
          }
        : undefined,
    [editing],
  );

  if (!isSysadmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Seguridad
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion de usuarios</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Crea, edita o elimina usuarios del sistema. Solo visible para sysadmin.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {users.length} usuarios
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <UserForm
          mode={editing ? 'edit' : 'create'}
          initialValues={formInitialValues}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditing(null)}
          submitting={submitting}
        />
        <UserTable users={users} loading={loading} onEdit={setEditing} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default UsersPage;
