import { useEffect, useState, type FormEvent } from 'react';
import { USER_TYPES, type UserType } from '../../core/types';

export type UserFormValues = {
  fullName: string;
  type: UserType;
  password?: string;
};

type UserFormProps = {
  mode: 'create' | 'edit';
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  onCancelEdit?: () => void;
  submitting?: boolean;
};

function UserForm({ mode, initialValues, submitting = false, onSubmit, onCancelEdit }: UserFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName ?? '');
  const [type, setType] = useState<UserType>(initialValues?.type ?? USER_TYPES.Service);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setFullName(initialValues?.fullName ?? '');
    setType(initialValues?.type ?? USER_TYPES.Service);
    setPassword('');
  }, [initialValues]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      fullName: fullName.trim(),
      type,
      password: password.trim() || undefined,
    });
  };

  const title = mode === 'edit' ? 'Editar usuario' : 'Crear usuario';
  const buttonLabel = mode === 'edit' ? 'Guardar cambios' : 'Crear usuario';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Usuarios
        </p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {mode === 'edit'
            ? 'Actualiza los datos del usuario seleccionado.'
            : 'Agrega rapidamente un nuevo usuario.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <span>Nombre completo</span>
          <input
            required
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Jane Doe"
            disabled={submitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
          />
        </label>

        <label className="block space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <span>Rol</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as UserType)}
            disabled={submitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
          >
            {Object.values(USER_TYPES).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <span>{mode === 'edit' ? 'Nueva clave (opcional)' : 'Clave'}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required={mode === 'create'}
            disabled={submitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          {mode === 'edit' && onCancelEdit ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              disabled={submitting}
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70"
          >
            {submitting ? 'Guardando...' : buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
