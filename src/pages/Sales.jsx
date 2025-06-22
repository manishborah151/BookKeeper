import React, {useEffect, useState} from "react";
import {exportToExcel} from "../utils/exportToExcel";

export default function Sales() {
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("sales");
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [];
  });

  const [saleData, setSaleData] = useState({
    sku: "",
    sellPrice: "",
    quantity: 1,
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({sellPrice: "", quantity: 1});

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  const handleSale = () => {
    const {sku, sellPrice, quantity} = saleData;
    const qty = parseInt(quantity);
    const price = parseFloat(sellPrice);
    const product = inventory.find((p) => p.sku === sku);

    if (!product) return alert("Product not found");
    if (product.stock < qty) return alert("Insufficient stock");

    const costPrice = product.costPrice;
    const profit = (price - costPrice) * qty;

    const newSale = {
      item: product.item,
      sku,
      sellPrice: price,
      costPrice,
      quantity: qty,
      profit,
      date: new Date().toISOString(),
    };

    const updatedInventory = inventory.map((p) =>
      p.sku === sku ? {...p, stock: p.stock - qty} : p
    );

    setSales([...sales, newSale]);
    setInventory(updatedInventory);
    setSaleData({sku: "", sellPrice: "", quantity: 1});
  };

  const handleDeleteSale = (index) => {
    const confirmDelete = window.confirm("Delete this sale?");
    if (!confirmDelete) return;

    const deleted = sales[index];

    // 1. Restore stock to inventory
    const updatedInventory = inventory.map((item) =>
      item.sku === deleted.sku
        ? {...item, stock: item.stock + deleted.quantity}
        : item
    );

    // 2. Remove the sale entry
    const updatedSales = [...sales];
    updatedSales.splice(index, 1);

    // 3. Update state
    setInventory(updatedInventory);
    setSales(updatedSales);

    // ✅ 4. Persist to localStorage
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  };
  const handleExport = () => {
    exportToExcel(sales, "Sales", "sales-export.xlsx");
  };

  const openEditSale = (index) => {
    const sale = sales[index];
    setEditIndex(index);
    setEditData({sellPrice: sale.sellPrice, quantity: sale.quantity});
  };

  const handleUpdateSale = () => {
    const original = sales[editIndex];
    const product = inventory.find((p) => p.sku === original.sku);
    if (!product) return;

    const prevQty = original.quantity;
    const newQty = parseInt(editData.quantity);
    const sellPrice = parseFloat(editData.sellPrice);
    const costPrice = original.costPrice;
    const stockChange = newQty - prevQty;

    const updatedInventory = inventory.map((p) =>
      p.sku === original.sku ? {...p, stock: p.stock - stockChange} : p
    );

    const invProduct = updatedInventory.find((p) => p.sku === original.sku);
    if (invProduct.stock < 0) return alert("Insufficient stock for update");

    const updatedSale = {
      ...original,
      sellPrice,
      quantity: newQty,
      profit: (sellPrice - costPrice) * newQty,
    };

    const updatedSales = [...sales];
    updatedSales[editIndex] = updatedSale;

    setSales(updatedSales);
    setInventory(updatedInventory);
    setEditIndex(null);
  };

  const filteredSales = sales.filter((s) => {
    const saleDate = new Date(s.date).setHours(0, 0, 0, 0);
    const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;
    return (!from || saleDate >= from) && (!to || saleDate <= to);
  });

  const totalSales = filteredSales.reduce(
    (acc, s) => acc + s.sellPrice * s.quantity,
    0
  );
  const avgSales = filteredSales.length
    ? (totalSales / filteredSales.length).toFixed(2)
    : 0;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">💰 Sales</h2>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 dark:bg-green-800 p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Total Sales</h4>
          <p className="text-xl font-bold">₹ {totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Average Sale</h4>
          <p className="text-xl font-bold">₹ {avgSales}</p>
        </div>
      </div>

      {/* Sale form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Make a Sale</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={saleData.sku}
            onChange={(e) => setSaleData({...saleData, sku: e.target.value})}
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 
             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Product</option>
            {inventory
              .filter((p) => p.stock > 0)
              .map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.item} ({p.sku})
                </option>
              ))}
          </select>
          <input
            type="number"
            placeholder="Sell Price"
            value={saleData.sellPrice}
            onChange={(e) =>
              setSaleData({...saleData, sellPrice: e.target.value})
            }
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 
             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={saleData.quantity}
            onChange={(e) =>
              setSaleData({...saleData, quantity: e.target.value})
            }
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 
             dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Live profit preview */}
        {saleData.sku &&
          saleData.sellPrice &&
          saleData.quantity &&
          (() => {
            const product = inventory.find((p) => p.sku === saleData.sku);
            const costPrice = product?.costPrice || 0;
            const profit =
              (parseFloat(saleData.sellPrice) - costPrice) *
              parseInt(saleData.quantity);

            return (
              <p
                className={`mt-2 text-sm font-medium ${
                  profit < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-700 dark:text-green-400"
                }`}
              >
                {profit < 0 ? "Loss : -" : "Profit :"} ₹{" "}
                {Math.abs(profit).toFixed(2)}
              </p>
            );
          })()}

        <button
          onClick={handleSale}
          disabled={!saleData.sku || !saleData.sellPrice || !saleData.quantity}
          className="mt-4 px-4 py-2 text-white rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Complete Sale
        </button>
      </div>

      {/* Date filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 
      dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {fromDate && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {new Date(fromDate).toLocaleDateString("en-GB")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 
      dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {toDate && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {new Date(toDate).toLocaleDateString("en-GB")}
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left p-2 ">Date </th>
              <th className="text-left p-2 ">Item</th>
              <th className="text-left p-2 ">SKU</th>
              <th className="text-left p-2 ">Sell Price </th>
              <th className="text-left p-2 ">Cost Price </th>
              <th className="text-left p-2 ">Qtn </th>
              <th className="text-left p-2 ">Profits </th>
              <th className="text-left p-2 ">Actions </th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No sales found.
                </td>
              </tr>
            ) : (
              [...filteredSales]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((s, i) => (
                  <tr
                    key={`${s.sku}-${s.date}`}
                    className="border-t border-gray-300 dark:border-gray-600"
                  >
                    <td className="p-2">
                      {new Date(s.date).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="p-2">{s.item}</td>
                    <td className="p-2">{s.sku}</td>
                    <td className="p-2">₹ {s.sellPrice}</td>
                    <td className="p-2">₹ {s.costPrice}</td>
                    <td className="p-2">{s.quantity}</td>
                    <td
                      className={`px-4 py-2 text-sm font-medium ${
                        s.profit < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹ {s.profit.toFixed(2)}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openEditSale(i)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSale(i)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Sale Modal */}
      {editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Sale</h3>
            <input
              type="number"
              className="w-full p-2 mb-2 border rounded dark:bg-gray-700"
              placeholder="Sell Price"
              value={editData.sellPrice}
              onChange={(e) =>
                setEditData({...editData, sellPrice: e.target.value})
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700"
              placeholder="Quantity"
              value={editData.quantity}
              onChange={(e) =>
                setEditData({...editData, quantity: e.target.value})
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditIndex(null)}
                className="px-4 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSale}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleExport}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Sales Table
      </button>
    </div>
  );
}
