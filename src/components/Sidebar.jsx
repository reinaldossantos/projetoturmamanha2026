import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

export function Sidebar() {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Clientes', path: '/clientes', icon: <Users size={20} /> },
    { title: 'Produtos', path: '/produtos', icon: <Package size={20} /> },
    { title: 'Nova Venda', path: '/vendas', icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800 flex flex-col gap-2">
        <h1 className="text-xl font-bold text-blue-400">Sistema ERP</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} className={isAdmin ? "text-green-500" : "text-blue-500"} />
          <span className="uppercase">{profile?.role || 'Acessando...'}</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium truncate">{profile?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}