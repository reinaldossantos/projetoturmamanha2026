import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function ClientForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('clients').insert([{ name, email }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      setName('');
      setEmail('');
      onSuccess(); // Avisa o componente pai para recarregar a lista
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 className="text-lg font-bold mb-4">Adicionar Novo Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" placeholder="Nome Completo" required
          className="p-2 border rounded"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" placeholder="E-mail" required
          className="p-2 border rounded"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button 
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
      >
        {loading ? 'Salvando...' : 'Salvar Cliente'}
      </button>
    </form>
  );
}