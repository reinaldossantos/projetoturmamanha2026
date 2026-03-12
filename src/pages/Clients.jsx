import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Trash2 } from 'lucide-react';

export function Clients() {
  const [clients, setClients] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // A função definida AQUI dentro resolve o problema de escopo
    const loadClients = async () => {
      const { data } = await supabase.from('clients').select('*').order('name');
      setClients(data || []);
    };
    
    loadClients();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Ação restrita a administradores.");
    if (confirm("Deseja realmente excluir este cliente?")) {
      await supabase.from('clients').delete().eq('id', id);
      window.location.reload(); 
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users /> Clientes</h1>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id} className="border-b">
              <td className="p-4">{client.name}</td>
              <td className="p-4 text-right">
                <button onClick={() => handleDelete(client.id)} className="text-red-500">
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}