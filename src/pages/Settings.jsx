import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";

export default function Settings() {
  const [modalContent, setModalContent] = useState(null);

  const { isDark, toggleTheme } = useTheme();

  const openModal = (type) => {
    switch (type) {
      case "author":
        setModalContent({
          title: "👨‍💻 Author",
          body: (
            <>
              <p>Name: Manish Borah</p>
              <p>Email: manish@example.com</p>
              <p>Location: Noida, India</p>
            </>
          ),
        });
        break;
      case "about":
        setModalContent({
          title: "ℹ️ About the App",
          body: (
            <ul className="list-disc pl-5">
              <li>Built with React, TailwindCSS, and Vite</li>
              <li>Charts powered by Chart.js</li>
              <li>Local data storage using localStorage</li>
              <li>Pages: Dashboard, Inventory, Sales, Settings</li>
              <li>Fully responsive, offline-first app</li>
            </ul>
          ),
        });
        break;
      case "features":
        setModalContent({
          title: "✅ Features",
          body: (
            <ul className="list-disc pl-5">
              <li>Add/Edit/Delete Products</li>
              <li>Sales tracking with profit/loss</li>
              <li>Dark/Light Mode toggle</li>
              <li>Export to Excel (.xlsx)</li>
              <li>Low Stock Notifications</li>
              <li>Dashboard with Bar and Doughnut Charts</li>
              <li>Sale Editing and Filtering</li>
            </ul>
          ),
        });
        break;
      default:
        setModalContent(null);
    }
  };
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (modalContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalContent]);

  const closeModal = () => setModalContent(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="grid grid-cols-2 grid-rows-2 gap-2 p-10">
        <button
          onClick={() => openModal("author")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded shadow"
        >
          👨‍💻 Author Info
        </button>
        <button
          onClick={() => openModal("about")}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded shadow"
        >
          ℹ️ About Application
        </button>
        <button
          onClick={() => openModal("features")}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded shadow"
        >
          ✅ Features
        </button>
        <div className="flex flex-col items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
          <span className="text-sm mr-2">
            {isDark ? "🌙 Dark" : "☀️ Light"}
          </span>
          <button
            onClick={toggleTheme}
            className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative"
          >
            <div
              className={` w-4 h-4 bg-white rounded-full shadow transition-all ${
                isDark ? "translate-x-5" : "translate-x-1 "
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {modalContent.title}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 dark:text-gray-300 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              {modalContent.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
