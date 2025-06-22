import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("Registration successful! You can now log in.");
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed. Try a different email."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md hover:from-purple-700 hover:to-blue-700 transition"
          >
            Register
          </button>
          {message && <div className="text-center text-red-500">{message}</div>}
        </form>
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
