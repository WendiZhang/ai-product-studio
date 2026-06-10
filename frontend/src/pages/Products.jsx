import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
          setProducts(data);
          setLoading(false);
      });
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      price: "",
      description: "",
    });
  };

  const saveEdit = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      }
    );

    const data = await response.json();

    setProducts(
      products.map((p) =>
        p.id === id ? data : p
      )
    );

    setEditingId(null);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      method: "DELETE",
    });

    setProducts(products.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            {products.length} products available
          </p>
          <p className="text-gray-500 mt-1">
            Manage your product catalog
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {products
              .filter((product) =>
                product.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((product) => (
              <div
                key={product.id}
                className="bg-white border shadow-sm rounded-2xl p-5 hover:shadow-lg transition"
              >
                {editingId === product.id ? (
                  // ✏️ EDIT MODE
                  <div className="space-y-3">

                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded-lg"
                    />

                    <input
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded-lg"
                    />

                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded-lg"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // 📦 VIEW MODE
                  <>
                    <h3 className="text-xl font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-indigo-600 font-bold">
                      ${product.price}
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      {product.description}
                    </p>

                    <div className="flex gap-2 mt-4">

                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>
                  </>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Products;