import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Alert from "@mui/material/Alert";
import axios from "axios";
function Register() {
  const API = "https://6845c68efc51878754dc3519.mockapi.io/users";
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!user.username) {
      setError("Please fill in Username field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!user.email) {
      setError("Please fill in Email field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!user.password) {
      setError("Please fill in Password field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!user.confirmPassword) {
      setError("Please fill in Confirm Password field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (user.username.length < 3) {
      setError("Username must be at least 3 characters long");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@tuwaiq\.com$/.test(user.email)) {
      setError("Email must end with tuwaiq.com");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    const existingUsers = await axios.get(API);

    const userExists = existingUsers.data.some(
      (existingUser) => existingUser.username === user.username
    );
    const emailExists = existingUsers.data.some(
      (existingUser) => existingUser.email === user.email
    );
    if (userExists) {
      setError("Username already exists");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (emailExists) {
      setError("Email already exists");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    axios
      .post(API, {
        username: user.username,
        email: user.email,
        password: user.password,
        type: user.type,
        assignedTeacherId: "",
        assignedTeacherName: "",
      })
      .then(() => {
        setSuccess("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        setError(`Catch Error: ${error.message}`);
        setTimeout(() => {
          setError("");
        }, 1000);
      });
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
          <h1 className="text-2xl">Welcome</h1>
          <p className="text-center text-lg w-3/4">
            Create your account to begin your graduation project journey. Once
            registered, you’ll be able to submit ideas, track their status, and
            stay connected with your team.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-neutral-100 h-full w-1/2">
          <div className="flex flex-col items-center  p-5 gap-5 md:px-10 ">
            <div className="flex flex-col items-center bg-gradient-to-br from-violet-400 to-violet-600 rounded-full">
              <RiAccountPinCircleFill className="text-6xl p-2 text-neutral-50" />
            </div>
            <h1 className="text-xl font-medium">Register</h1>
            <div className="flex flex-col items-center gap-3">
              <input
                className="border border-gray-300/50 p-2 px-5 rounded-lg w-72 focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                type="text"
                name="username"
                placeholder="Enter username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <input
                className="border border-gray-300/50 p-2 px-5 rounded-lg w-72 focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                type="email"
                name="email"
                placeholder="Enter email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <div className="relative w-72">
                <input
                  className="border border-gray-300/50 p-2 px-5 rounded-lg w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
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

              <div className="relative w-72">
                <input
                  className="border border-gray-300/50 p-2 px-5 rounded-lg w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Confirm password"
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      confirmPassword: e.target.value,
                    })
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
              <p className="text-sm text-gray-500">
                already have an account?{" "}
                <Link
                  className="hover:underline cursor-pointer hover:text-violet-600"
                  to="/login"
                >
                  Login
                </Link>
              </p>

              <button
                className="bg-violet-600 text-white p-2 rounded-lg w-40 hover:bg-violet-600 transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
                type="submit"
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
