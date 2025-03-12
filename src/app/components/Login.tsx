"use client";
import React, { useState } from "react";
import { login } from "../utils/requests";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export const Loader = () => (
  <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
);

const LoginForm: React.FC = () => {
  const uniqueId = uuidv4();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await login({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);
    if (res?.status === 200) {
      toast.success("Success");
      redirect("/home");
    } else if (res?.status == 404) {
      toast.success("User not found");
      setFormData({ email: "", password: "" });
    } else {
      toast.error("Internal Server Error");
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading && <Loader />} Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
