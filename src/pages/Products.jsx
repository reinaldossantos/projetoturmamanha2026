import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Trash2, AlertTriangle, PlusCircle } from 'lucide-react'; // Adicionado PlusCircle
import { ProductForm } from '../components/ProductForm';
import { useAuth } from '../contexts/AuthContext';

export function Products() {
  const [products, setProducts] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  // --- NOVA FUNÇÃO: ATUALIZAR ESTOQUE ---
  const handleAddStock = async (product) => {
    const amount = prompt(`Quantas unidades de "${product.name}" deseja ADICIONAR ao estoque atual?`);
    
    if (amount === null || amount === "" || isNaN(amount)) return;

    const newStock = parseInt(product.stock) + parseInt(amount);

    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product.id);

    if (error) {
      alert("Erro ao atualizar: " + error.message);
    } else {
      // Atualiza a lista localmente sem recarregar a página inteira
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
    }
  };
  // ---------------------------------------

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Ação restrita a administradores.");
    if (confirm("Deseja excluir este produto?")) {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <Package className="text-blue-600" /> Gestão de Estoque
      </h1>

      <ProductForm onSuccess={() => window.location.reload()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border relative group">
            <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
            <p className="text-2xl font-black text-blue-600 mt-1">
              R$ {Number(product.price).toFixed(2)}
            </p>
            
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Estoque disponível</span>
                <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {product.stock} unidades
                </span>
              </div>
              
              {/* Botão de Adicionar Estoque */}
              <button 
                onClick={() => handleAddStock(product)}
                className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                <PlusCircle size={14} /> Repor
              </button>
            </div>

            {product.stock <= 5 && (
              <div className="absolute top-4 right-12 text-red-500 animate-pulse" title="Estoque Baixo">
                <AlertTriangle size={18} />
              </div>
            )}

            <button 
              onClick={() => handleDelete(product.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}