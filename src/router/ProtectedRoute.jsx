import React from "react";
import { useNavigate, Outlet } from "react-router";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const userType = localStorage.getItem("type");
  const userName = localStorage.getItem("username");
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  const isAuthenticated = userType && userName && userId;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
