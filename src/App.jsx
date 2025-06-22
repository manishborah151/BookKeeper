import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import {ThemeProvider} from "./components/ThemeContext";
import React from "react";

const Settings = React.lazy(() => import("./pages/Settings"));
const Sales = React.lazy(() => import("./pages/Sales"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
