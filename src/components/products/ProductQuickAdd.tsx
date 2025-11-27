import { useState, type FormEvent } from 'react';

export type CreateProductInput = {
  name: string;
  quantity: number;
  sku?: string;
  location?: string;
  description?: string;
  barcodes?: string;
};

type ProductDraft = {
  name: string;
  sku: string;
  quantity: number | string;
  location: string;
  description: string;
  barcodes: string;
};

type ProductQuickAddProps = {
  onSubmit: (products: CreateProductInput[]) => void | Promise<void>;
  submitting?: boolean;
};

const buildDraft = (): ProductDraft => ({
  name: '',
  sku: '',
  quantity: 0,
  location: '',
  description: '',
  barcodes: '',
});

function ProductQuickAdd({ submitting = false, onSubmit }: ProductQuickAddProps) {
  const [drafts, setDrafts] = useState<ProductDraft[]>([buildDraft()]);

  const handleChange = (index: number, field: keyof ProductDraft, value: string | number) => {
    setDrafts((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleRemove = (index: number) => {
    setDrafts((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));
  };

  const handleAddRow = () => setDrafts((prev) => [...prev, buildDraft()]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = drafts
      .map<CreateProductInput | null>((item) => {
        const name = item.name.trim();
        if (!name) return null;

        return {
          name,
          sku: item.sku.trim() || undefined,
          quantity: Math.max(0, Number(item.quantity) || 0),
          location: item.location.trim() || undefined,
          description: item.description.trim() || undefined,
          barcodes: item.barcodes.trim() || undefined,
        };
      })
      .filter((item): item is CreateProductInput => Boolean(item));

    if (normalized.length === 0) {
      return;
    }

    try {
      await onSubmit(normalized);
      setDrafts([buildDraft()]);
    } catch {
      // keep values so the user can corregir y reintentar
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Productos
        </p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Agregar rapido</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Crea uno o varios productos a la vez. Deja SKU vacio para autogenerar.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          {drafts.map((draft, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Producto #{index + 1}
                </p>
                {drafts.length > 1 ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60 dark:text-rose-200"
                    onClick={() => handleRemove(index)}
                    disabled={submitting}
                  >
                    Quitar
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>Nombre</span>
                  <input
                    required
                    type="text"
                    value={draft.name}
                    onChange={(event) => handleChange(index, 'name', event.target.value)}
                    placeholder="Bebida energetica"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                  />
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>SKU (opcional)</span>
                  <input
                    type="text"
                    value={draft.sku}
                    onChange={(event) => handleChange(index, 'sku', event.target.value)}
                    placeholder="SKU-123"
                    disabled={submitting}
                    className="w-full rounded-xl border border-dashed border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>Cantidad</span>
                  <input
                    min={0}
                    type="number"
                    value={draft.quantity}
                    onChange={(event) => handleChange(index, 'quantity', event.target.value)}
                    placeholder="0"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                  />
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>Ubicacion</span>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(event) => handleChange(index, 'location', event.target.value)}
                    placeholder="Estante A"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                  />
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>Barcodes</span>
                  <input
                    type="text"
                    value={draft.barcodes}
                    onChange={(event) => handleChange(index, 'barcodes', event.target.value)}
                    placeholder="EAN/UPC"
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>Descripcion</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => handleChange(index, 'description', event.target.value)}
                  placeholder="Notas o detalles"
                  disabled={submitting}
                  className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={submitting}
            className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            + Agregar otro
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
          >
            {submitting ? 'Guardando...' : 'Guardar productos'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductQuickAdd;
