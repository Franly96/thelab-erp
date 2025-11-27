import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ProductForm, { type ProductFormValues } from '../../components/products/ProductForm';
import { USER_TYPES, type Category, type Product } from '../../core/types';
import type { MainLayoutContext } from '../../layouts/MainLayout';
import { toast } from 'react-hot-toast';

type ApiProduct = Product & { category?: Category | null };

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const normalizeProduct = (item: ApiProduct): Product => ({
  id: item.id,
  name: item.name,
  sku: item.sku,
  quantity: item.quantity ?? 0,
  location: item.location ?? 'N/A',
  description: item.description ?? 'N/A',
  barcodes: item.barcodes ?? 'N/A',
  category: item.category
    ? {
        id: item.category.id,
        name: item.category.name,
        createdAt: item.category.createdAt,
        updatedAt: item.category.updatedAt,
      }
    : null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useOutletContext<MainLayoutContext>();
  const canAccess =
    user.type === USER_TYPES.Sysadmin ||
    user.type === USER_TYPES.Admin ||
    user.type === USER_TYPES.Manager;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canAccess) return;
    if (!id) return;
    let active = true;

    const load = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiUrl}/inventory/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = (await response.json()) as ApiProduct;
        if (!active) return;
        setProduct(normalizeProduct(data));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo cargar el producto';
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [canAccess, id]);

  const formValues: ProductFormValues | null = useMemo(() => {
    if (!product) return null;
    return {
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      location: product.location,
      description: product.description,
      barcodes: product.barcodes,
    };
  }, [product]);

  const handleUpdate = async (values: ProductFormValues) => {
    if (!product) return;
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      sku: values.sku || undefined,
      quantity: values.quantity,
      location: values.location || 'N/A',
      description: values.description || 'N/A',
      barcodes: values.barcodes || 'N/A',
    };

    try {
      const response = await fetch(`${apiUrl}/inventory/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el producto');
      }

      const data = (await response.json()) as ApiProduct;
      setProduct(normalizeProduct(data));
      toast.success('Producto actualizado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar cambios';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const confirmed = window.confirm('¿Eliminar este producto?');
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/inventory/${product.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
      }
      toast.success('Producto eliminado');
      navigate('/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  };

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  if (!id) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Inventario
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detalle del producto</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Actualiza o elimina este articulo. Los cambios son inmediatos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            ← Volver al listado
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || loading || !product}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 hover:shadow-md disabled:translate-y-0 disabled:opacity-70 dark:border-rose-900/60 dark:bg-rose-900/30 dark:text-rose-200"
          >
            {saving ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          Cargando producto...
        </div>
      ) : product && formValues ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <ProductForm initialValues={formValues} onSubmit={handleUpdate} submitting={saving} />

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Resumen
              </p>
              <div className="mt-3 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <p>
                  SKU: <span className="font-bold text-slate-900 dark:text-white">{product.sku}</span>
                </p>
                <p>
                  Stock:{' '}
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                    {product.quantity}
                  </span>
                </p>
                <p>Ubicacion: {product.location}</p>
                <p>Categoria: {product.category?.name ?? 'Sin categoria'}</p>
                <p>Ultima actualizacion: {new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          Producto no encontrado.
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
