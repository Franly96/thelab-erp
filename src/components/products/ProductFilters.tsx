type StockFilter = 'all' | 'in-stock' | 'out-of-stock';

type ProductFiltersProps = {
  search: string;
  stock: StockFilter;
  onSearchChange: (value: string) => void;
  onStockChange: (value: StockFilter) => void;
  onReset?: () => void;
};

function ProductFilters({ search, stock, onSearchChange, onStockChange, onReset }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:border-sky-400 dark:focus-within:ring-sky-800/60">
          <span aria-hidden>🔎</span>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o SKU"
            className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={stock}
          onChange={(event) => onStockChange(event.target.value as StockFilter)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-800/60"
        >
          <option value="all">Todo el inventario</option>
          <option value="in-stock">Con stock</option>
          <option value="out-of-stock">Sin stock</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>
    </div>
  );
}

export type { StockFilter };
export default ProductFilters;
