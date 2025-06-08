import React, { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail } from "../utils/helper";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (password !== retypePassword) {
      setError("Passwords don't match");
      return;
    }

    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
      });
      if (response.data) {
        const userId = response.data._id;
        navigate(`/${userId}/notes`);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl text-blue-600 font-bold mb-6 text-center">
          Notes App
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              type="text"
              placeholder="John Wall"
              onChange={(e) => setName(e.target.value)}
            />
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
            <Input
              label="Retype Password"
              value={retypePassword}
              type="password"
              placeholder="1234!#$%"
              onChange={(e) => setRetypePassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
          >
            SIGN UP
          </button>
          <p className="text-center text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-blue-600 underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
