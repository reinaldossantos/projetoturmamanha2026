import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { NewSale } from './pages/NewSale';
import { SalesHistory } from './pages/SalesHistory';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  History, 
  LogOut 
} from 'lucide-react';
import { supabase } from './lib/supabase';

// 1. Componente de Proteção de Rota
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  return user ? children : <Navigate transition to="/login" />;
}

// 2. Componente de Layout (Menu Lateral + Conteúdo)
function Layout({ children }) {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">SISTEMA ERP</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <MenuLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <MenuLink to="/clientes" icon={<Users size={20} />} label="Clientes" />
          <MenuLink to="/produtos" icon={<Package size={20} />} label="Produtos" />
          <MenuLink to="/nova-venda" icon={<ShoppingCart size={20} />} label="Nova Venda" />
          <MenuLink to="/historico" icon={<History size={20} />} label="Histórico" />
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-400 hover:bg-slate-800 transition-colors border-t border-slate-800"
        >
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// Helper para os links do menu
function MenuLink({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
      {icon}
      <span>{label}</span>
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

          {/* Rotas Privadas (Envoltas pelo Layout e PrivateRoute) */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/clientes" element={
            <PrivateRoute>
              <Layout><Clients /></Layout>
            </PrivateRoute>
          } />

          <Route path="/produtos" element={
            <PrivateRoute>
              <Layout><Products /></Layout>
            </PrivateRoute>
          } />

          <Route path="/nova-venda" element={
            <PrivateRoute>
              <Layout><NewSale /></Layout>
            </PrivateRoute>
          } />

          <Route path="/historico" element={
            <PrivateRoute>
              <Layout><SalesHistory /></Layout>
            </PrivateRoute>
          } />

          {/* Redirecionar qualquer rota desconhecida para o Dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}