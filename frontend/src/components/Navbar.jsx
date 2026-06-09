import { Link, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left - Logo */}
        <div className="text-xl font-bold text-gray-900">
          AI Studio
        </div>

        {/* Middle - Links */}
        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>

          <Link to="/products" className={linkClass("/products")}>
            Products
          </Link>

          <Link to="/generate" className={linkClass("/generate")}>
            Generate
          </Link>
        </div>

        {/* Right - Logout */}
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;