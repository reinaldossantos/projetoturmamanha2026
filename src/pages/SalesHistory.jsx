import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, Calendar, User, Printer, ChevronRight } from 'lucide-react';

export function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`id, total_amount, created_at, clients ( name )`)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setSales(data || []);
      setLoading(false);
    };
    loadSales();
  }, []);

  const handlePrint = (sale) => {
    // Criamos uma janela temporária para impressão ou usamos a atual com estilos específicos
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="p-8">
      {/* Classe 'no-print' garante que isso não saia no papel */}
      <div className="no-print">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <History className="text-blue-600" /> Histórico de Vendas
        </h1>
      </div>

      <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Data</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Cliente</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Total</th>
              <th className="p-4 text-right no-print">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50 transition-colors sale-row">
                <td className="p-4 text-sm text-gray-700">
                  {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-sm font-medium text-gray-700 capitalize">
                  {sale.clients?.name || 'Cliente removido'}
                </td>
                <td className="p-4 text-sm font-bold text-green-600">
                  R$ {Number(sale.total_amount).toFixed(2)}
                </td>
                <td className="p-4 text-right no-print">
                  <button 
                    onClick={() => handlePrint(sale)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Imprimir Comprovante"
                  >
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estilo para Impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          aside { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          body { background: white !important; }
          .sale-row { page-break-inside: avoid; }
          table { width: 100% !important; border: 1px solid #eee; }
        }
      `}} />
    </div>
  );
}