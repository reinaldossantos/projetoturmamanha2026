import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingCart, Plus, CheckCircle } from 'lucide-react';

export function Sales() {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase.from('products').select('*');
      const { data: c } = await supabase.from('clients').select('*');
      setProducts(p || []);
      setClients(c || []);
    };
    fetchData();
  }, []);

  const addToCart = (p) => setCart([...cart, p]);
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handleFinish = async () => {
    if (!selectedClient || cart.length === 0) return alert("Preencha todos os dados!");
    
    const { error } = await supabase.from('sales').insert({
      client_id: selectedClient,
      total_amount: total
    });

    if (!error) {
      alert("Venda realizada!");
      setCart([]);
      setSelectedClient('');
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Selecione os Produtos</h2>
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
              <span className="font-medium">{p.name} (R$ {p.price})</span>
              <button onClick={() => addToCart(p)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                <Plus size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingCart /> Carrinho</h2>
        <select 
          className="w-full p-3 rounded-lg mb-4 border border-gray-300"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">-- Selecione o Cliente --</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="space-y-2 min-h-[200px]">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between bg-white p-3 rounded shadow-sm">
              <span>{item.name}</span>
              <span className="font-bold text-blue-600">R$ {item.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-2xl font-bold mb-6">
            <span>Total:</span>
            <span className="text-green-600 font-black text-3xl">R$ {total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleFinish}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={22} /> Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}