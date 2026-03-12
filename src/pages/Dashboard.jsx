import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, DollarSign, Users, Package } from 'lucide-react';

export function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    clientsCount: 0,
    productsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Definimos a função de busca DENTRO do useEffect para evitar erros de referência
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Busca contagem de clientes
        const { count: clients } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
        
        // 2. Busca contagem de produtos
        const { count: products } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // 3. Busca faturamento (Soma das vendas)
        const { data: sales } = await supabase
          .from('sales')
          .select('total_amount');

        const total = sales?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

        setStats({
          totalSales: total,
          clientsCount: clients || 0,
          productsCount: products || 0
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Array vazio significa que executa apenas uma vez ao carregar a página

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Carregando indicadores...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <LayoutDashboard className="text-blue-600" /> Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Faturamento - Lógica de visibilidade Admin */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">Total em Vendas</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {isAdmin ? `R$ ${stats.totalSales.toFixed(2)}` : "R$ ********"}
              </h2>
              {!isAdmin && <p className="text-xs text-red-400 mt-1 italic">Acesso restrito ao Admin</p>}
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>

        {/* Card de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">Clientes Ativos</p>
              <h2 className="text-2xl font-bold text-gray-800">{stats.clientsCount}</h2>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        {/* Card de Produtos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">Itens no Catálogo</p>
              <h2 className="text-2xl font-bold text-gray-800">{stats.productsCount}</h2>
            </div>
            <Package className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <h3 className="text-blue-800 font-bold">Área do Administrador</h3>
            <p className="text-blue-600 text-sm">Você tem acesso aos relatórios financeiros detalhados.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
            Exportar Dados
          </button>
        </div>
      )}
    </div>
  );
}