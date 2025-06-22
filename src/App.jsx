import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NavBar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeContext";

function App() {
  return (
     
   <Router>
    <ThemeProvider>
    <Layout>
      <Routes>
        <Route path= "/" element={<Dashboard/>}/>
        <Route path= "/inventory" element={<Inventory/>}/>
        <Route path= "/sales" element={<Sales/>}/>
        <Route path= "/settings" element={<Settings/>}/>
      </Routes>
    </Layout>
    </ThemeProvider>
   </Router>
   
  );
}

export default App;
