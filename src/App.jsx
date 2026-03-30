import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Historical from "./pages/Historical";
import { Cloud, History } from "lucide-react";
import "./App.css";

function Navigation() {
  return (
    <nav className="glass-panel main-nav">
      <div className="nav-logo flex-center">
        <Cloud className="text-accent" size={28} />
        <h2>Lattice Weather</h2>
      </div>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Cloud size={20} /> Current
        </NavLink>
        <NavLink
          to="/historical"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <History size={20} /> Historical
        </NavLink>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/historical" element={<Historical />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
