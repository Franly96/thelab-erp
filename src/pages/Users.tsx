import { useMemo, useState, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { USER_TYPES, type PublicUser, type UserType } from '../core/types';
import type { MainLayoutContext } from '../layouts/MainLayout';

type ManagedUser = PublicUser & {
  status: 'active' | 'invited';
};

const nowDate = () => new Date();

const seedUsers: ManagedUser[] = [
  {
    id: 1,
    fullName: 'Valeria Campos',
    type: USER_TYPES.Manager,
    status: 'active',
    createdAt: nowDate().toString(),
    updatedAt: nowDate().toString(),
  },
  {
    id: 2,
    fullName: 'Sergio Alvarez',
    type: USER_TYPES.Sysadmin,
    status: 'active',
    createdAt: nowDate().toString(),
    updatedAt: nowDate().toString(),
  },
  {
    id: 3,
    fullName: 'Ana Rios',
    type: USER_TYPES.Service,
    status: 'invited',
    createdAt: nowDate().toString(),
    updatedAt: nowDate().toString(),
  },
];

const newId = () => Number(`${Date.now()}`.slice(-8));

function Users() {
  const { user } = useOutletContext<MainLayoutContext>();
  const [users, setUsers] = useState<ManagedUser[]>(seedUsers);
  const [form, setForm] = useState<Omit<ManagedUser, 'id' | 'status'>>({
    fullName: '',
    type: USER_TYPES.Service,
    createdAt: nowDate().toString(),
    updatedAt: nowDate().toString(),
  });

  const activeCount = useMemo(() => users.filter((item) => item.status === 'active').length, [users]);
  const sysadminCount = useMemo(
    () => users.filter((item) => item.type === USER_TYPES.Sysadmin).length,
    [users],
  );
  const invitedCount = useMemo(() => users.filter((item) => item.status === 'invited').length, [users]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUsers((prev) => [
      {
        id: newId(),
        ...form,
        status: 'invited',
        createdAt: nowDate().toString(),
        updatedAt: nowDate().toString(),
      },
      ...prev,
    ]);

    setForm({
      fullName: '',
      type: USER_TYPES.Service,
      createdAt: nowDate().toString(),
      updatedAt: nowDate().toString(),
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Usuarios
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Control de acceso</h2>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Solo un perfil sysadmin puede ver y editar esta seccion. El usuario actual es {user.fullName}.
          </p>
        </div>
        <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold uppercase text-indigo-800 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-900/40 dark:text-indigo-100">
          Sysadmin only
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">Activos</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-900 dark:text-white">{activeCount}</strong>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Con acceso vigente</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">Sysadmins</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-900 dark:text-white">{sysadminCount}</strong>
          <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">Control total</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">Invitaciones</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-900 dark:text-white">{invitedCount}</strong>
          <span className="text-sm text-slate-600 dark:text-slate-400">Pendientes</span>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Personas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Invita, asigna tipo de perfil y controla quienes entran.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase text-slate-800 dark:bg-slate-700 dark:text-slate-100">
              Autenticado: {user.type}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                <thead className="bg-slate-100/70 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Creado</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <strong className="text-sm text-slate-900 dark:text-white">{item.fullName}</strong>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">ID: {item.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                            item.type === USER_TYPES.Sysadmin
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100'
                              : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Crear nuevo usuario</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">No hay llamadas reales; el estado solo vive en esta pantalla.</p>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <span>Nombre</span>
              <input
                required
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Nombre y apellido"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <span>Tipo</span>
              <select
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as UserType }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              >
                <option value={USER_TYPES.Service}>service</option>
                <option value={USER_TYPES.Manager}>manager</option>
                <option value={USER_TYPES.Admin}>admin</option>
                <option value={USER_TYPES.Sysadmin}>sysadmin</option>
              </select>
            </label>

            <button
              className="col-span-full w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              type="submit"
            >
              Invitar
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Users;
