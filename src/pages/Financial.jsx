import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Plus, Wallet } from 'lucide-react';

export function Financial() {
  const [salesTotal, setSalesTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    // 1. Buscar Total de Vendas
    const { data: sales } = await supabase.from('sales').select('total_amount');
    const totalS = sales?.reduce((acc, s) => acc + Number(s.total_amount), 0) || 0;
    setSalesTotal(totalS);

    // 2. Buscar Despesas
    const { data: exp } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    setExpenses(exp || []);
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!desc || !val) return;

    const { error } = await supabase.from('expenses').insert([{ description: desc, amount: parseFloat(val) }]);
    if (error) alert(error.message);
    else {
      setDesc('');
      setVal('');
      fetchFinancialData();
    }
  };

  const expensesTotal = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const balance = salesTotal - expensesTotal;

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando financeiro...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-800">
        <Wallet className="text-emerald-600" /> Gestão Financeira
      </h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center text-blue-600 mb-2">
            <span className="text-sm font-bold uppercase">Entradas (Vendas)</span>
            <ArrowUpCircle size={24} />
          </div>
          <p className="text-2xl font-black text-gray-800">R$ {salesTotal.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center text-red-600 mb-2">
            <span className="text-sm font-bold uppercase">Saídas (Despesas)</span>
            <ArrowDownCircle size={24} />
          </div>
          <p className="text-2xl font-black text-gray-800">R$ {expensesTotal.toFixed(2)}</p>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${balance >= 0 ? 'border-emerald-500' : 'border-orange-500'}`}>
          <div className={`flex justify-between items-center ${balance >= 0 ? 'text-emerald-600' : 'text-orange-600'} mb-2`}>
            <span className="text-sm font-bold uppercase">Saldo Final (Lucro)</span>
            <DollarSign size={24} />
          </div>
          <p className="text-2xl font-black text-gray-800">R$ {balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Despesa */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
          <h3 className="font-bold mb-4 text-gray-700">Lançar Nova Despesa</h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <input 
              type="text" placeholder="Descrição (ex: Aluguel)" required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              value={desc} onChange={(e) => setDesc(e.target.value)}
            />
            <input 
              type="number" step="0.01" placeholder="Valor R$" required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              value={val} onChange={(e) => setVal(e.target.value)}
            />
            <button className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition flex items-center justify-center gap-2">
              <Plus size={20} /> Registrar Saída
            </button>
          </form>
        </div>

        {/* Lista de Despesas */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">Últimos Gastos</div>
          <div className="divide-y max-h-80 overflow-y-auto">
            {expenses.map(e => (
              <div key={e.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <span className="text-gray-700 font-medium">{e.description}</span>
                <span className="text-red-500 font-bold">- R$ {Number(e.amount).toFixed(2)}</span>
              </div>
            ))}
            {expenses.length === 0 && <p className="p-8 text-center text-gray-400">Nenhuma despesa lançada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}