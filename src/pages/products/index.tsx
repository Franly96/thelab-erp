import { useEffect, useMemo, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import ProductFilters, { type StockFilter } from '../../components/products/ProductFilters';
import ProductTable, { type ProductTableValues } from '../../components/products/ProductTable';
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

function ProductsPage() {
  const { user } = useOutletContext<MainLayoutContext>();
  const canAccess =
    user.type === USER_TYPES.Sysadmin ||
    user.type === USER_TYPES.Admin ||
    user.type === USER_TYPES.Manager;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stock, setStock] = useState<StockFilter>('all');

  useEffect(() => {
    if (!canAccess) return;
    let active = true;

    const load = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiUrl}/inventory`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const data = (await response.json()) as ApiProduct[];
        if (!active) return;
        setProducts(data.map(normalizeProduct));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error inesperado al cargar productos';
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
  }, [canAccess]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term);
      const matchesStock =
        stock === 'all'
          ? true
          : stock === 'in-stock'
            ? product.quantity > 0
            : product.quantity === 0;
      return matchesSearch && matchesStock;
    });
  }, [products, search, stock]);

  const handleCreate = async (item: ProductTableValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el producto');
      }

      const data = (await response.json()) as ApiProduct;
      setProducts((prev) => [normalizeProduct(data), ...prev]);
      toast.success('Producto creado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear productos';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number, item: ProductTableValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el producto');
      }

      const data = (await response.json()) as ApiProduct;
      setProducts((prev) => prev.map((p) => (p.id === id ? normalizeProduct(data) : p)));
      toast.success('Producto actualizado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStock('all');
  };

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Inventario
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Productos</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Filtra y gestiona productos directamente en la tabla o ve su detalle.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {products.length} productos
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <ProductFilters
        search={search}
        stock={stock}
        onSearchChange={setSearch}
        onStockChange={setStock}
        onReset={resetFilters}
      />

      <ProductTable
        products={filteredProducts}
        loading={loading}
        submitting={submitting}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default ProductsPage;
