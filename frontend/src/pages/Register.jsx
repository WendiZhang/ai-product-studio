import { useState } from "react";
import axios from "axios";

export default function Register({ onRegisterSuccess,
  goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        email,
        password,
      });

      setMessage("Account created successfully ✅");

      // optional: auto switch to login or auto-login
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

    } catch (err) {
      setMessage(
        err.response?.data?.error || "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Create account
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Start generating AI-powered product descriptions
        </p>

        <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">

          <input
            autoFocus
            type="email"
            placeholder="Email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              minLength={8}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <p className="text-xs text-gray-500">
            Password must be at least 8 characters
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {message && (
          <p className='text-sm text-center text-gray-600 mt-4 ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }'>
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?
        </p>

        <button
          onClick={goToLogin}
          className="w-full mt-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}