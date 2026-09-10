import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Generate from "./pages/Generate";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} goToRegister={() => navigate("/register")} />
          }
        />

        <Route
          path="/register"
          element={
            <Register
              onRegisterSuccess={() => navigate("/login")}
              goToLogin={() => navigate("/login")}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    );
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Dashboard token={token} />} />
        <Route path="/products" element={<Products token={token} />} />
        <Route path="/generate" element={<Generate token={token} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
