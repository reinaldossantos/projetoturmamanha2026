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
      const { data: clientsData } = await supabase.from('clients').select('*').order('name');
      const { data: productsData } = await supabase.from('products').select('*').order('name');
      setClients(clientsData || []);
      setProducts(productsData || []);
    };
    loadData();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleFinishSale = async () => {
    if (!selectedClient) return alert("Por favor, selecione um cliente.");
    if (cart.length === 0) return alert("O carrinho está vazio.");

    setLoading(true);
    try {
      // Inserção na tabela 'sales' conforme os atributos da sua imagem
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([
          { 
            client_id: selectedClient, 
            total_amount: total 
          }
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      alert("Venda registrada com sucesso!");
      setCart([]);
      setSelectedClient('');
      
    } catch (error) {
      alert("Erro ao finalizar venda: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Lado Esquerdo: Seleção e Produtos */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <ShoppingCart className="text-blue-600" /> Nova Venda
          </h2>
          
          <label className="block text-sm font-medium text-gray-600 mb-2">Cliente</label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Selecione o cliente...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold mb-4 text-gray-700">Adicionar Produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-blue-600 text-sm font-bold">R$ {Number(p.price).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => addToCart(p)}
                  className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado Direito: Carrinho e Total */}
      <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
        <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Resumo da Venda</h3>
        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">{item.qty}x R$ {Number(item.price).toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum item adicionado</p>}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Total:</span>
            <span className="text-2xl font-black text-gray-900">R$ {total.toFixed(2)}</span>
          </div>
          <button 
            disabled={loading || cart.length === 0}
            onClick={handleFinishSale}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:bg-gray-200 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            {loading ? 'Salvando...' : 'Confirmar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
}