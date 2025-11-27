import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import QuickLinkCard from '../../components/common/QuickLinkCard';
import ChartCard from '../../components/dashboard/ChartCard';
import DashboardHeader from '../../components/dashboard/Header';
import TopProductsList, { type TopProduct } from '../../components/dashboard/TopProductsList';
import type { MainLayoutContext } from '../../layouts/MainLayout';

const quickLinks = [
  //{ title: 'POS', value: 3, color: 'bg-rose-500', icon: '🧾' },
  { title: 'Productos', value: 21, color: 'bg-orange-500', icon: '📦' },
  { title: 'Ventas', value: 524, color: 'bg-amber-400', icon: '🛍️' },
  //{ title: 'Compras', value: 8, color: 'bg-emerald-500', icon: '🛒' },
  //{ title: 'Categorias', value: 7, color: 'bg-sky-500', icon: '🗂️' },
  //{ title: 'Tarjeta de regalo', value: 1, color: 'bg-fuchsia-500', icon: '🎁' },
  //{ title: 'Clientes', value: 12, color: 'bg-red-500', icon: '👥' },
  //{ title: 'Configuracion', value: 6, color: 'bg-amber-600', icon: '⚙️' },
  //{ title: 'Informes', value: 4, color: 'bg-slate-600', icon: '📊' },
  { title: 'Usuarios', value: 2, color: 'bg-blue-600', icon: '🧑‍💼' },
  //{ title: 'Backup', value: 3, color: 'bg-slate-700', icon: '💾' },
  //{ title: 'Tiendas', value: 5, color: 'bg-emerald-600', icon: '🏬' },
];

const topProducts: TopProduct[] = [
  { name: 'Bebidas', sales: 12 },
  { name: 'Snacks', sales: 11 },
  { name: 'Limpieza', sales: 10 },
  { name: 'Cuidado personal', sales: 9 },
];

function Dashboard() {
  const { user } = useOutletContext<MainLayoutContext>();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} greeting={greeting} />

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Enlaces rapidos</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <QuickLinkCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <ChartCard
          title="Grafico de las ventas"
          periodLabel="Nov 2018"
          description="Grafico placeholder — conecta tus datos para ver la evolucion de ventas y comparativos de impuestos y descuentos."
        />
        <TopProductsList periodLabel="Mes en curso" products={topProducts} />
      </section>
    </div>
  );
}

export default Dashboard;
