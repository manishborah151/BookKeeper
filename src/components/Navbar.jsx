import { Link, useLocation } from "react-router-dom";
// import { useTheme  } from "../components/ThemeContext";
import { useState } from "react";
import { Menu, X, Gauge, Boxes, BadgeDollarSign, Settings } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  // const {darkMode, setDarkmode} =useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Gauge className="w-5 h-5" /> },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Boxes className="w-5 h-5" />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <BadgeDollarSign className="w-5 h-5 " />,
    },
    {
      name: "Settings",
      path: "/Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen w-64 fixed top-0 left-0 transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
       <div className="flex items-center justify-center px-4 py-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-xl font-bold">InventoryMS</h1>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
             className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                pathname === path
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {icon}
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        {/* 
        //Theme Toggle

        <div className="mt-4 px-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded text-center"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div> */}
      </aside>

      {/* Page content overlay (mobile) */}
      {isOpen && (
       <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

       {/* Single Toggle Button for both states */}
       <button
        className="absolute top-4 left-4 z-50 md:hidden bg-gray-200 dark:bg-gray-700 p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-800 dark:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
        )}
      </button>
    </div>
  );
}
