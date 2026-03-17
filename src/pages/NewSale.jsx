import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingCart, Plus, Trash2, CheckCircle } from 'lucide-react';

export function NewSale() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data: c } = await supabase.from('clients').select('*').order('name');
      const { data: p } = await supabase.from('products').select('*').order('name');
      setClients(c || []);
      setProducts(p || []);
    };
    loadData();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.qty : 0;

    if (product.stock <= currentQty) {
      return alert("Estoque insuficiente para este produto!");
    }

    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleFinishSale = async () => {
    if (!selectedClient || cart.length === 0) return alert("Selecione o cliente e adicione itens.");

    setLoading(true);
    try {
      // 1. Criar a Venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{ client_id: selectedClient, total_amount: total }])
        .select().single();

      if (saleError) throw saleError;

      // 2. Atualizar estoque de cada item (Baixa Automática)
      for (const item of cart) {
        const newStock = item.stock - item.qty;
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
        
        if (updateError) throw updateError;
      }

      alert("Venda concluída e estoque atualizado!");
      setCart([]);
      setSelectedClient('');
      window.location.reload(); // Recarrega para atualizar os dados de estoque locais

    } catch (error) {
      alert("Erro ao processar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <ShoppingCart className="text-blue-600" size={24} /> PDV - Frente de Caixa
          </h2>
          <select 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Selecione o Cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4 text-gray-700">Produtos em Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-blue-600 text-sm font-bold">R$ {Number(p.price).toFixed(2)}</p>
                  <p className={`text-[10px] font-bold uppercase ${p.stock <= 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    Disp: {p.stock}
                  </p>
                </div>
                <button 
                  disabled={p.stock <= 0}
                  onClick={() => addToCart(p)}
                  className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl h-fit sticky top-8">
        <h3 className="font-bold mb-6 text-xl border-b border-slate-700 pb-4">Carrinho</h3>
        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-blue-400 text-xs">{item.qty}x R$ {item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-1 hover:bg-red-400/10 rounded">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400">Total</span>
            <span className="text-3xl font-black">R$ {total.toFixed(2)}</span>
          </div>
          <button 
            disabled={loading || cart.length === 0}
            onClick={handleFinishSale}
            className="w-full bg-blue-500 py-4 rounded-2xl font-bold hover:bg-blue-400 transition-all disabled:bg-slate-700 disabled:text-slate-500"
          >
            {loading ? 'Processando...' : 'Finalizar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
}