import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Definir a função dentro do efeito garante que o JS a reconheça imediatamente
    const loadProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data || []);
    };
    
    loadProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Package /> Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-6 rounded shadow border">
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-blue-600 font-bold text-xl">R$ {Number(p.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}