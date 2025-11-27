export type TopProduct = {
  name: string;
  sales: number;
};

type TopProductCardProps = {
  rank: number;
  name: string;
  sales: number;
};

function TopProductCard({ rank, name, sales }: TopProductCardProps) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
      <span>
        {rank}. {name}
      </span>
      <span className="text-slate-500 dark:text-slate-300">+{sales} ventas</span>
    </li>
  );
}

export type TopProductsListProps = {
  periodLabel: string;
  products: TopProduct[];
};

function TopProductsList({ periodLabel, products }: TopProductsListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top productos</h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{periodLabel}</span>
      </div>
      <ul className="space-y-3">
        {products.map((item, index) => (
          <TopProductCard key={item.name} rank={index + 1} name={item.name} sales={item.sales} />
        ))}
      </ul>
    </div>
  );
}

export default TopProductsList;
