import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../core/types';

export type ProductTableValues = {
  name: string;
  sku?: string;
  quantity: number;
  location?: string;
  description?: string;
  barcodes?: string;
};

type ProductTableProps = {
  products: Product[];
  loading?: boolean;
  submitting?: boolean;
  onCreate?: (values: ProductTableValues) => void | Promise<void>;
  onUpdate?: (id: number, values: ProductTableValues) => void | Promise<void>;
};

type Draft = {
  name: string;
  sku: string;
  quantity: number | string;
  location: string;
  description: string;
  barcodes: string;
};

const buildDraft = (product?: Product): Draft => ({
  name: product?.name ?? '',
  sku: product?.sku ?? '',
  quantity: product?.quantity ?? 0,
  location: product?.location ?? '',
  description: product?.description ?? '',
  barcodes: product?.barcodes ?? '',
});

function ProductTable({ products, loading = false, submitting = false, onCreate, onUpdate }: ProductTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(buildDraft());

  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const working = submitting;

  useEffect(() => {
    if (typeof editingId === 'number') {
      const current = products.find((item) => item.id === editingId);
      if (current) {
        setDraft(buildDraft(current));
      }
    }
  }, [editingId, products]);

  const normalizeValues = (values: Draft): ProductTableValues | null => {
    const name = values.name.trim();
    if (!name) return null;
    return {
      name,
      sku: values.sku.trim() || undefined,
      quantity: Math.max(0, Number(values.quantity) || 0),
      location: values.location.trim() || undefined,
      description: values.description.trim() || undefined,
      barcodes: values.barcodes.trim() || undefined,
    };
  };

  const handleChange = (field: keyof Draft, value: string | number) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setDraft(buildDraft());
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft(buildDraft(product));
  };

  const handleSubmit = async () => {
    const values = normalizeValues(draft);
    if (!values) return;

    try {
      if (editingId === null) {
        await onCreate?.(values);
      } else {
        await onUpdate?.(editingId, values);
      }
      setEditingId(null);
      setDraft(buildDraft());
    } catch {
      // keep draft for retry
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isEditing ? 'Los cambios se guardan en el backend.' : 'Captura rapida antes de la tabla.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartCreate}
            disabled={working}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            Limpiar
          </button>
        </div>
        <div className="grid gap-3 lg:grid-cols-6">
          <label className="lg:col-span-2">
            <input
              required
              type="text"
              value={draft.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
            />
          </label>
          <label>
            <input
              type="text"
              value={draft.sku}
              onChange={(event) => handleChange('sku', event.target.value)}
              placeholder="SKU"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
            />
          </label>
          <label>
            <input
              min={0}
              type="number"
              value={draft.quantity}
              onChange={(event) => handleChange('quantity', event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
              placeholder="Cantidad"
            />
          </label>
          <label>
            <input
              type="text"
              value={draft.description}
              onChange={(event) => handleChange('description', event.target.value)}
              placeholder="Descripcion"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
            />
          </label>
          <label>
            <input
              type="text"
              value={draft.location}
              onChange={(event) => handleChange('location', event.target.value)}
              placeholder="Ubicacion"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
            />
          </label>
          <label>
            <input
              type="text"
              value={draft.barcodes}
              onChange={(event) => handleChange('barcodes', event.target.value)}
              placeholder="Barcodes"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
              disabled={working}
            />
          </label>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleStartCreate}
              disabled={working}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={working}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60"
          >
            {working ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Lista</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Productos en inventario</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {products.length} en total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-900/50 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-5 py-3 text-left">
                Producto
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Codigo
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Cantidad
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Ubicacion
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Sin productos por ahora.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60">
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                    <div className="space-y-1">
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{product.location}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {onUpdate ? (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(product)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          disabled={isEditing && editingId !== product.id}
                        >
                          Editar
                        </button>
                      ) : null}
                      <Link
                        to={`/products/${product.id}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ProductTable;
