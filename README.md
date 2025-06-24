# 📦 Book Keeper - Inventory Management System

**Boo Keeper** is a modern, responsive, and easy-to-use inventory management system designed for single-user use. It helps small businesses or solo operators efficiently manage their inventory, track sales, calculate profits, and generate insightful reports—all through a sleek React-based UI.

**DEMO**:https://manishborah151.github.io/BookKeeper/
---

## 📌 Features

### 🌐 General
- Single-user, local-only application
- Built using **React**, **Tailwind CSS**, **Chart.js**, and **Material UI**
- Dark mode / Light mode toggle
- Fully responsive and mobile-friendly
- No external database or backend setup required

### 🧮 Inventory Management
- Add, edit, delete products
- Track product details: Name, SKU, category, price, cost price, stock
- Auto-decrease stock on sale
- Filter products by stock level (All, In Stock, Out of Stock)
- Search by name or SKU
- Newest items appear at the top
- Export inventory data to `.xlsx` file

### 💰 Sales Orders
- Record sales with dynamic sell prices
- Quantity selection (blocked if stock is insufficient)
- Calculate and display profit (sell price - cost price)
- Historical sales data maintained in local `.json` file
- Profit calculation uses cost price at time of sale (not the updated one)
- Automatic stock update on sale
- Filter by date range and search by customer name

### 📊 Dashboard
- Overview of:
  - Total Sales (Daily, Weekly, Monthly)
  - Total Inventory Value
  - Total Profit
- Sales, profit, and stock visualized using **Chart.js**
- Option to download key metrics and sales/inventory reports as `.xlsx`

### 📁 Reports
- View/export reports for:
  - Inventory
  - Sales orders
  - Profit summaries
- Custom date filters
- Clean tabular format for review or printing

### 👥 Customers
- Track customers who have made purchases
- Basic contact info and purchase history

### ⚙️ Settings
- App theme toggle (dark/light)
- Popups (modals/lightboxes) for:
  - About the app
  - Author information
  - Features summary
- Reset all data option (clears localStorage and `.json` files)
  
---

## 🏗️ Tech Stack

| Category       | Tech Used                        |
|----------------|----------------------------------|
| Frontend       | React, JavaScript, Vite          |
| Styling        | Tailwind CSS, Material UI, Uiverse.io components |
| Charts         | Chart.js                         |
| File Export    | xlsx (SheetJS)                   |
| Local DB       | localStorage (frontend only)     |
| Data Files     | `.json` files stored locally     |
| Date Utils     | Day.js                           |

---

## 📂 Folder Structure

```plaintext
boo-keeper/
├── public/
├── src/
│   ├── components/        # Reusable UI elements
│   ├── pages/             # Dashboard, Inventory, Sales, Settings etc.
│   ├── utils/             # Excel export, formatting helpers
│   ├── data/              # JSON files (sales, inventory)
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── tailwind.config.js
├── package.json
└── README.md
