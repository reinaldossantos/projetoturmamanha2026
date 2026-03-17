import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { NewSale } from './pages/NewSale';
import { SalesHistory } from './pages/SalesHistory';
import { Financial } from './pages/Financial'; // Importação do novo módulo
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  History, 
  LogOut,
  Wallet 
} from 'lucide-react';
import { supabase } from './lib/supabase';

// 1. Componente de Proteção de Rota
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Autenticando...</div>;
  return user ? children : <Navigate to="/login" />;
}

// 2. Componente de Layout (Menu Lateral + Conteúdo)
function Layout({ children }) {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Menu Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black tracking-tight text-blue-400">
            SISTEMA <span className="text-white">ERP</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <MenuLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest pl-3">
            Cadastros
          </div>
          <MenuLink to="/clientes" icon={<Users size={20} />} label="Clientes" />
          <MenuLink to="/produtos" icon={<Package size={20} />} label="Produtos" />
          
          <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest pl-3">
            Operacional
          </div>
          <MenuLink to="/nova-venda" icon={<ShoppingCart size={20} />} label="Nova Venda" />
          <MenuLink to="/historico" icon={<History size={20} />} label="Histórico" />
          
          <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest pl-3">
            Gestão
          </div>
          <MenuLink to="/financeiro" icon={<Wallet size={20} />} label="Financeiro" />
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-all border-t border-slate-800 font-medium"
        >
          <LogOut size={20} /> Encerrar Sessão
        </button>
      </aside>

      {/* Main Content - Área de Conteúdo */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper para os links do menu (fica azul quando passa o mouse)
function MenuLink({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-600 transition-all group text-slate-400 hover:text-white">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

// 3. Componente Principal App
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Bloco de Rotas Privadas Protegidas */}
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><Layout><Clients /></Layout></PrivateRoute>} />
          <Route path="/produtos" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
          <Route path="/nova-venda" element={<PrivateRoute><Layout><NewSale /></Layout></PrivateRoute>} />
          <Route path="/historico" element={<PrivateRoute><Layout><SalesHistory /></Layout></PrivateRoute>} />
          <Route path="/financeiro" element={<PrivateRoute><Layout><Financial /></Layout></PrivateRoute>} />

          {/* Fallback - Redireciona para o Dashboard se a rota não existir */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}