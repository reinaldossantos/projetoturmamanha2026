import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function ProductForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('products')
      .insert([{ 
        name, 
        price: parseFloat(price), 
        stock: parseInt(stock) 
      }]);

    if (error) {
      alert("Erro ao salvar produto: " + error.message);
    } else {
      setName('');
      setPrice('');
      setStock('');
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Cadastrar Produto com Estoque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
          <input 
            type="text" placeholder="Ex: Mouse Gamer" required
            className="p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Preço (R$)</label>
          <input 
            type="number" step="0.01" placeholder="0.00" required
            className="p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={price} onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Estoque Inicial</label>
          <input 
            type="number" placeholder="Ex: 50" required
            className="p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={stock} onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>
      <button 
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300"
      >
        {loading ? 'Salvando...' : 'Salvar Produto'}
      </button>
    </form>
  );
}