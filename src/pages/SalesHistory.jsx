import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, Calendar, User, Printer, Search } from 'lucide-react';
import { SaleReceipt } from '../components/SaleReceipt';

export function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      // Buscamos a venda e pedimos para o Supabase trazer o 'name' da tabela 'clients' relacionada
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          total_amount,
          created_at,
          client_id,
          clients ( name, email )
        `)
        .order('created_at', { ascending: false });

      if (error) console.error("Erro ao carregar histórico:", error);
      else setSales(data || []);
      setLoading(false);
    };

    loadSales();
  }, []);

  // Filtro de busca por nome do cliente
  const filteredSales = sales.filter(sale => 
    sale.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Carregando histórico...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Modal do Recibo - Só aparece se houver uma venda selecionada */}
      {selectedSale && (
        <SaleReceipt 
          sale={selectedSale} 
          onClose={() => setSelectedSale(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <History className="text-blue-600" /> Histórico de Vendas
        </h1>

        {/* Barra de Busca */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {sale.clients?.name || 'Cliente não identificado'}
                  </div>
                </td>
                <td className="p-4 text-sm font-black text-green-600">
                  R$ {Number(sale.total_amount).toFixed(2)}
                </td>
                <td className="p-4 text-right no-print">
                  <button 
                    onClick={() => setSelectedSale(sale)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                    title="Ver Recibo"
                  >
                    <Printer size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSales.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            {searchTerm ? 'Nenhuma venda encontrada para esta busca.' : 'Nenhuma venda registrada no sistema.'}
          </div>
        )}
      </div>
    </div>
  );
}