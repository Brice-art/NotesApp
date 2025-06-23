import React, { useState } from "react";
import Input from "./Input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail } from "../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login API call

    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
        if (response.data) {
            const userId = response.data._id;
            navigate(`/${userId}/notes`)
        }
    } catch (error) {
        setError("Something went wrong");
    }

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl text-blue-600 font-bold mb-6 text-center">Notes App</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            value={email}
            type="text"
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            value={password}
            type="password"
            placeholder="1234!#$%"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">
            LOGIN
          </button>

          <p className="text-center text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-blue-600 underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
