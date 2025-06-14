import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoClose } from "react-icons/io5";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("type");
    navigate("/login");
  };

  return (
    <div>
      <nav className="flex justify-between  items-center h-13 lg:h-16 text-white bg-gradient-to-b from-violet-500 to-violet-600  w-full fixed px-5 md:px-5 lg:px-25 py-1.5 shadow-md z-50">
        <div className="flex h-full  items-center ">
          <img
            className="h-full w-25 lg:w-40 object-cover p-0.5 bg-white rounded-2xl shadow-md"
            src="https://sadasaudi.net/wp-content/uploads/2024/10/logo-h-scaled.webp"
            alt=""
          />
          <ul className="hidden gap-5 ml-10 text-lg font-medium text-neutral-200 lg:flex">
            <Link
              to="/"
              className="transition duration-500 ease-in-out hover:text-white hover:scale-105"
            >
              <li>Home</li>
            </Link>
            <Link
              to="/dashboard"
              className="transition duration-500 ease-in-out hover:text-white hover:scale-105"
            >
              <li>Dashboard</li>
            </Link>
          </ul>
        </div>
        <div className="hidden lg:flex items-center w-full justify-end ">
          {localStorage.getItem("username") ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center bg-white text-violet-600 rounded-full p-2">
                <FaUser className="text-xl" />
              </div>
              <p className="text-lg">{localStorage.getItem("username")}</p>
              <button
                onClick={() => handleLogout()}
                className=" bg-white text-violet-600 px-4 py-1 rounded hover:bg-violet-100 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleLogin()}
              className="bg-white text-violet-600 px-4 py-1 rounded hover:bg-violet-100 transition cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
        {/* Mobile Menu */}
        <div
          className={` fixed  top-12 right-0 w-full  bg-gradient-to-b from-violet-600 to-violet-800 text-white transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-[100%]"
          }`}
        >
          <ul className="flex flex-col gap-3 p-5 text-base lg:hidden ">
            <Link to="/" onClick={toggleMenu}>
              <li>Home</li>
            </Link>
            <Link to="/dashboard" onClick={toggleMenu}>
              <li>Dashboard</li>
            </Link>
          </ul>
          <div className="flex flex-col gap-5 pb-5 pl-5 text-lg lg:hidden ">
            {localStorage.getItem("username") ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-white text-violet-600 rounded-full p-1.5">
                  <FaUser className="text-sm " />
                </div>
                <p className="text-base ">{localStorage.getItem("username")}</p>
                <button
                  onClick={() => handleLogout()}
                  className=" bg-white text-sm text-violet-600 px-2 py-1 rounded hover:bg-violet-100 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleLogin()}
                className="bg-white text-violet-600 px-4 py-1 w-30 rounded hover:bg-violet-100 transition cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
        <div className="lg:hidden">
          {isOpen ? (
            <IoClose className="text-3xl" onClick={toggleMenu} />
          ) : (
            <HiMiniBars3BottomRight className="text-2xl" onClick={toggleMenu} />
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
