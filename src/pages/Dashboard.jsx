import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";
import {useNavigate} from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const inv = localStorage.getItem("inventory");
    if (inv) setInventory(JSON.parse(inv));
  }, []);
  const [sales, setSales] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const lowStockItems = inventory.filter((item) => item.stock <= 5);
  const lowStockCount = lowStockItems.length;

  useEffect(() => {
    const saved = localStorage.getItem("sales");
    if (saved) setSales(JSON.parse(saved));
  }, []);

  // 📅 Today's date in YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const todaySales = sales.filter((s) => s.date.slice(0, 10) === today);
  const totalTodaySales = todaySales.reduce(
    (acc, s) => acc + s.sellPrice * s.quantity,
    0
  );
  const totalTodayProfit = todaySales.reduce((acc, s) => acc + s.profit, 0);

  // 🔢 Group sales data by label
  const groupSalesByTime = () => {
    const grouped = {};

    sales.forEach((sale) => {
      const date = new Date(sale.date);
      let label = "";

      if (timeRange === "week") {
        label = date.toLocaleDateString("en-IN", {weekday: "short"}); // Mon, Tue...
      } else if (timeRange === "month") {
        label = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }); // 12 Jun
      } else if (timeRange === "year") {
        label = date.toLocaleDateString("en-IN", {month: "short"}); // Jan, Feb
      }

      if (!grouped[label]) grouped[label] = 0;
      grouped[label] += sale.profit;
    });

    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped),
    };
  };
  const getTopSellingProducts = () => {
    const productMap = {};

    sales.forEach((sale) => {
      const key = sale.item;

      if (!productMap[key]) {
        productMap[key] = {
          item: sale.item,
          quantity: 0,
        };
      }

      productMap[key].quantity += sale.quantity;
    });

    const sorted = Object.values(productMap).sort(
      (a, b) => b.quantity - a.quantity
    );
    return sorted.slice(0, 5); // Top 5
  };

  const topProducts = getTopSellingProducts();

  const doughnutData = {
    labels: topProducts.map((p) => p.item),
    datasets: [
      {
        label: "Quantity Sold",
        data: topProducts.map((p) => p.quantity),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
        borderColor: "#fff",
        borderWidth: 1,
        options: {
          layout: {
            padding: 20,
          },
        },
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} sold`;
          },
        },
      },
    },
  };

  const chartData = groupSalesByTime();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Profit",
        data: chartData.data,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderRadius: 10, // Rounded bars
        barPercentage: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹ ${value}`,
        },
      },
    },
  };
  const [showLowStockBanner, setShowLowStockBanner] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {lowStockCount > 0 && showLowStockBanner && (
        <div
          onClick={() => navigate("/inventory")}
          className="mb-4 p-4 rounded bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 flex justify-between items-center shadow cursor-pointer hover:bg-yellow-200 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>
              {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} low
              in stock!
            </span>
          </div>
          <button
            className="text-xl font-bold text-yellow-800 hover:text-yellow-600"
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigating to inventory
              setShowLowStockBanner(false);
            }}
          >
            &times;
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>

      {/* Top Summary Boxes */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Total Sales (Today)</h4>
          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
            ₹ {totalTodaySales.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-800 p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Total Profit (Today)</h4>
          <p className="text-xl font-bold text-green-700 dark:text-green-200">
            ₹ {totalTodayProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Range Selector */}
      <div className="flex gap-4 mb-4">
        {["week", "month", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md  ${
              timeRange === range
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Bar Chart */}
        <div className="basis-2/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          {chartData.labels.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No data to display.
            </p>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
        {/* Top-Selling Doughnut Chart */}
        <div className="basis-1/3 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            🔥 Top-Selling Products
          </h3>

          {topProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No sales data available.
            </p>
          ) : (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          )}
        </div>
      </div>
    </div>
  );
}
