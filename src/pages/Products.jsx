import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Package, Trash2 } from "lucide-react";
import { ProductForm } from "../components/ProductForm";
import { useAuth } from "../contexts/AuthContext";

export function Products() {
  const [products, setProducts] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("name");
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Ação restrita a administradores.");
    if (confirm("Deseja excluir este produto?")) {
      await supabase.from("products").delete().eq("id", id);
      window.location.reload();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Package className="text-purple-600" /> Produtos
      </h1>

      {/* Formulário de Cadastro */}
      <ProductForm onSuccess={() => window.location.reload()} />

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow relative group"
          >
            <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
            <p className="text-2xl font-black text-purple-600 mt-2">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          Nenhum produto cadastrado.
        </p>
      )}
    </div>
  );
}
