import {useEffect, useState} from "react";
import {exportInventoryToExcel} from "../utils/exportToExcel";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all | in | out
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    item: "",
    sku: "",
    costPrice: "",
    stock: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const updated = products.map((p) =>
      p.createdAt ? p : {...p, createdAt: Date.now()}
    );
    setProducts(updated);
  }, []);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
    const {item, sku, costPrice, stock} = newProduct;
    if (!item || !sku || !costPrice || !stock) {
      alert("All fields are required");
      return;
    }

    const formatted = {
      ...newProduct,
      costPrice: parseFloat(costPrice),
      stock: parseInt(stock),
      createdAt: Date.now(),
    };

    setProducts([formatted, ...products]);
    setShowAddModal(false);
    setNewProduct({item: "", sku: "", costPrice: "", stock: ""});
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditProduct({...products[index]});
    setShowEditModal(true);
  };

  const handleUpdateProduct = () => {
    const {item, sku, costPrice, stock} = editProduct;
    if (!item || !sku || !costPrice || !stock) {
      alert("All fields are required");
      return;
    }

    const updated = [...products];
    updated[editIndex] = {
      ...editProduct,
      costPrice: parseFloat(costPrice),
      stock: parseInt(stock),
    };
    setProducts(updated);
    setShowEditModal(false);
    setEditIndex(null);
    setEditProduct(null);
  };

  const handleDeleteProduct = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const exportToExcel = () => {
    if (products.length === 0) {
      alert("No products to export");
      return;
    }
    exportInventoryToExcel(products);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📦 Inventory</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Product
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by item or SKU..."
          className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">SKU</th>
              <th className="text-left p-2">Cost Price</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...products]
              .sort((a, b) => b.createdAt - a.createdAt)
              .filter((p) => {
                const matchesSearch =
                  p.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesFilter =
                  stockFilter === "all"
                    ? true
                    : stockFilter === "in"
                    ? p.stock > 0
                    : p.stock <= 0;

                return matchesSearch && matchesFilter;
              })
              .map((p, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-300 dark:border-gray-600"
                >
                  <td className="p-2">{p.item}</td>
                  <td className="p-2">{p.sku}</td>
                  <td className="p-2">₹ {p.costPrice}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    {p.stock > 5 ? (
                      <span className="text-green-600 font-semibold">
                        In Stock
                      </span>
                    ) : p.stock > 0 ? (
                      <span className="text-yellow-600 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(i)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(i)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
            <div className="space-y-3">
              {["item", "sku", "costPrice", "stock"].map((field) => (
                <input
                  key={field}
                  type={
                    field === "costPrice" || field === "stock"
                      ? "number"
                      : "text"
                  }
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  value={newProduct[field]}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <div className="space-y-3">
              {["item", "sku", "costPrice", "stock"].map((field) => (
                <input
                  key={field}
                  type={
                    field === "costPrice" || field === "stock"
                      ? "number"
                      : "text"
                  }
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  value={editProduct[field]}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
