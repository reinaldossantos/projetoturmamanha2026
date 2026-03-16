import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Trash2 } from 'lucide-react';
import { ClientForm } from '../components/ClientForm';

export function Clients() {
  const [clients, setClients] = useState([]);
  const { isAdmin } = useAuth();

  // Função interna para buscar clientes (padrão blindado contra erros)
  useEffect(() => {
    const loadClients = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      setClients(data || []);
    };
    
    loadClients();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Ação restrita a administradores.");
    if (confirm("Deseja realmente excluir este cliente?")) {
      await supabase.from('clients').delete().eq('id', id);
      // Recarrega a página para atualizar a tabela após a exclusão
      window.location.reload(); 
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users /> Clientes
      </h1>

      {/* Formulário de Cadastro */}
      <ClientForm onSuccess={handleReload} />

      {/* Tabela de Listagem */}
      <div className="bg-white shadow rounded-lg overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 uppercase text-sm font-bold text-gray-600">Nome</th>
              <th className="p-4 uppercase text-sm font-bold text-gray-600">E-mail</th>
              <th className="p-4 text-right uppercase text-sm font-bold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{client.name}</td>
                <td className="p-4">{client.email}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(client.id)} 
                    className="text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}