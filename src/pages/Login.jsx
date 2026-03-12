import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Se login sucesso, redireciona para o Dashboard
      navigate('/dashboard'); 
    } catch (error) {
      alert("Erro ao entrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Acesso ao Sistema</h2>
        <input 
          type="email" placeholder="E-mail" required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
        >
          {loading ? 'Entrando...' : 'Entrar no Sistema'}
        </button>
      </form>
    </div>
  );
}