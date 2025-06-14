import React from "react";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
function Login() {
  const API = "https://6845c68efc51878754dc3519.mockapi.io/users";

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!user.email) {
      setError("Please fill in Email field");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }
    if (!user.password) {
      setError("Please fill in Password field");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }
    try {
      const response = await axios.get(API);
      const users = response.data;
      const foundEmail = users.find((u) => u.email === user.email);
      if (!foundEmail) {
        setError("Email not found");
        setTimeout(() => {
          setError("");
        }, 1000);
        return;
      }
      const correctPassword = foundEmail.password === user.password;
      if (!correctPassword) {
        setError("Incorrect password");
        setTimeout(() => {
          setError("");
        }, 1000);
        return;
      }
      localStorage.setItem("username", foundEmail.username);
      localStorage.setItem("email", foundEmail.email);
      localStorage.setItem("type", foundEmail.type);
      localStorage.setItem("id", foundEmail.id);
      localStorage.setItem(
        "assignedTeacherId",
        foundEmail.assignedTeacherId || "null"
      );
      setSuccess("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-55"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-55"
        >
          {success}
        </Alert>
      )}
      <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100">
        <div className="hidden md:flex flex-col gap-y-5 items-center justify-center bg-gradient-to-bl from-violet-600 to-violet-800 text-white h-full w-1/2 rounded-r-4xl">
          <h1 className="text-2xl">Welcome back!</h1>
          <p className="text-center text-lg w-3/4">
            Please enter your email and password to access your account and
            continue managing your projects, ideas, and collaborations. Let’s
            keep your work moving forward.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-neutral-100 h-full w-1/2">
          <div className="flex flex-col items-center bg-neutral-150 p-5 gap-5 md:px-10 rounded-lg shadow-md">
            <div className="flex flex-col items-center bg-gradient-to-br from-violet-600 to-violet-800 rounded-full">
              <RiAccountPinCircleFill className="text-6xl p-2 text-neutral-50" />
            </div>
            <h1 className="text-xl font-medium">Login</h1>

            <div className="flex flex-col items-center gap-3">
              <input
                className="border border-gray-300/50 p-2 px-5 rounded-lg w-72 focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                type="email"
                name="email"
                placeholder="Enter Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <div className="relative w-72">
                <input
                  className="border border-gray-300/50 p-2 px-5 rounded-lg w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
              <p>
                Don't have an account?{" "}
                <Link
                  className="hover:underline cursor-pointer hover:text-violet-600"
                  to="/register"
                >
                  Register
                </Link>
              </p>

              <p className="text-center text-sm ">OR Sign in with</p>

              <div className="flex gap-x-3 w-full justify-center">
                <button className="flex items-center justify-center bg-neutral-800 p-2 px-7 rounded-lg  hover:bg-neutral-700 transition-colors duration-300 shadow-md hover:shadow-xl cursor-pointer">
                  <FaFacebook className="inline text-2xl text-neutral-50" />
                </button>
                <button className="flex items-center justify-center bg-neutral-800 p-2 px-7 rounded-lg  hover:bg-neutral-700 transition-colors duration-300 shadow-md hover:shadow-xl cursor-pointer">
                  <FaGoogle className="inline text-2xl text-neutral-50" />
                </button>
                <button className="flex items-center justify-center bg-neutral-800 p-2 px-7 rounded-lg  hover:bg-neutral-700 transition-colors duration-300 shadow-md hover:shadow-xl cursor-pointer">
                  <FaGithub className="inline text-2xl text-neutral-50" />
                </button>
              </div>

              <button
                className="bg-violet-600 text-white p-2 rounded-lg w-40 hover:bg-violet-600 transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
                type="submit"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
