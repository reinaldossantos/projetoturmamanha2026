import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    clientsCount: 0,
    productsCount: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Contagens básicas
        const { count: clients } = await supabase.from('clients').select('*', { count: 'exact', head: true });
        const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
        
        // 2. Dados de Vendas para o Gráfico
        const { data: sales } = await supabase
          .from('sales')
          .select('total_amount, created_at')
          .order('created_at', { ascending: true });

        // Processar faturamento total
        const total = sales?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

        // Agrupar vendas por data para o gráfico
        const chartMap = sales?.reduce((acc, sale) => {
          const date = new Date(sale.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          acc[date] = (acc[date] || 0) + Number(sale.total_amount);
          return acc;
        }, {});

        const chartData = Object.keys(chartMap || {}).map(date => ({
          date,
          valor: chartMap[date]
        })).slice(-7); // Mostrar os últimos 7 dias com vendas

        setStats({
          totalSales: total,
          clientsCount: clients || 0,
          productsCount: products || 0,
          chartData
        });
      } catch (error) {
        console.error("Erro no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-500">Carregando inteligência de dados...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <LayoutDashboard className="text-blue-600" size={32} /> Resumo Executivo
        </h1>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          Atualizado agora
        </span>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Faturamento Total" 
          value={isAdmin ? `R$ ${stats.totalSales.toFixed(2)}` : "R$ *****"}
          icon={<DollarSign className="text-green-600" />}
          color="border-green-500"
        />
        <StatCard 
          label="Carteira de Clientes" 
          value={stats.clientsCount}
          icon={<Users className="text-blue-600" />}
          color="border-blue-500"
        />
        <StatCard 
          label="Produtos Ativos" 
          value={stats.productsCount}
          icon={<Package className="text-purple-600" />}
          color="border-purple-500"
        />
      </div>

      {/* Área do Gráfico */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-700">Desempenho de Vendas (Últimos Dias)</h2>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Sub-componente para os Cards
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}