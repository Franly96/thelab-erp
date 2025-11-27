import { useEffect, useState, type FormEvent } from 'react';

export type ProductFormValues = {
  name: string;
  sku: string;
  quantity: number;
  location: string;
  description: string;
  barcodes: string;
};

type ProductFormProps = {
  initialValues: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  submitting?: boolean;
};

function ProductForm({ initialValues, submitting = false, onSubmit }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (field: keyof ProductFormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...values,
      name: values.name.trim(),
      sku: values.sku.trim(),
      location: values.location.trim(),
      description: values.description.trim(),
      barcodes: values.barcodes.trim(),
      quantity: Math.max(0, Number(values.quantity) || 0),
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Producto
        </p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Editar datos</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Actualiza el nombre, SKU o cantidad de este articulo.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Nombre</span>
            <input
              required
              type="text"
              value={values.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Producto"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>SKU</span>
            <input
              type="text"
              value={values.sku}
              onChange={(event) => handleChange('sku', event.target.value)}
              placeholder="SKU-001"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Cantidad</span>
            <input
              min={0}
              type="number"
              value={values.quantity}
              onChange={(event) => handleChange('quantity', event.target.value)}
              placeholder="0"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Ubicacion</span>
            <input
              type="text"
              value={values.location}
              onChange={(event) => handleChange('location', event.target.value)}
              placeholder="Estante A"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Barcodes</span>
            <input
              type="text"
              value={values.barcodes}
              onChange={(event) => handleChange('barcodes', event.target.value)}
              placeholder="EAN/UPC"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <span>Descripcion</span>
          <textarea
            value={values.description}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="Notas o detalles"
            disabled={submitting}
            className="h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-70"
        >
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
