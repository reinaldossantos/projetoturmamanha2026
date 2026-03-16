import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function ProductForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertemos o preço para número antes de enviar
    const { error } = await supabase
      .from('products')
      .insert([{ name, price: parseFloat(price) }]);

    if (error) {
      alert("Erro ao salvar produto: " + error.message);
    } else {
      setName('');
      setPrice('');
      onSuccess(); // Recarrega a lista
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Adicionar Novo Produto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Nome do Produto</label>
          <input 
            type="text" placeholder="Ex: Teclado Mecânico" required
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Preço (R$)</label>
          <input 
            type="number" step="0.01" placeholder="0.00" required
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={price} onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <button 
        disabled={loading}
        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 transition-colors"
      >
        {loading ? 'Salvando...' : 'Salvar Produto'}
      </button>
    </form>
  );
}