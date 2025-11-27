import type { User } from '../../core/types';

type UserTableProps = {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

function UserTable({ users, loading = false, onEdit, onDelete }: UserTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Lista
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Usuarios registrados</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {users.length} en total
        </span>
      </div>

      {users.length === 0 ? (
        <div className="p-5 text-sm font-semibold text-slate-600 dark:text-slate-300">Sin usuarios por ahora.</div>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((user) => (
            <li key={user.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    {user.type}
                  </span>
                  <span>
                    Creado: {new Date(user.createdAt).toLocaleDateString()} — Actualizado:{' '}
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  onClick={() => onEdit(user)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 hover:shadow-md dark:border-rose-900/60 dark:bg-rose-900/30 dark:text-rose-200"
                  onClick={() => onDelete(user.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserTable;
