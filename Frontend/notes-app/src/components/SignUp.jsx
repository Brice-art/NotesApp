import React, { useState } from "react";
import Input from "./Input";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

    //Sign up API call

    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
      });
      if (response.data) {
        const userId = response.data._id;
        navigate(`/notes/${userId}`);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };
  return (
    <div className="flex justify-center">
      <div className="md:w-[50%] h-3/4 md:h-full flex flex-col justify-center">
        <h1 className="text-4xl text-blue-500">Notes App</h1>
        <form onSubmit={handleSignUp}>
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

          {error && <p className="text-red-500 text-xs pb-2 5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className=" text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
