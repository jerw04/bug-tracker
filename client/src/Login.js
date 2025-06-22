import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);

    // ✅ Save BOTH tokens
    localStorage.setItem("token", res.data.token);
    console.log("LOGIN RESPONSE", res.data);

    localStorage.setItem("refreshToken", res.data.refreshToken);

    setMessage("Login successful!");
    setForm({ email: "", password: "" });
    navigate("/dashboard");
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Login failed. Check your credentials."
    );
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6">
          Sign In to Bug Tracker
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-md hover:from-blue-700 hover:to-purple-700 transition"
          >
            Login
          </button>
          {message && <div className="text-center text-red-500">{message}</div>}
        </form>
        <p className="mt-6 text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
