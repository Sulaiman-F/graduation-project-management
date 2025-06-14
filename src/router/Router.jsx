import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Nav from "../componetn/Nav";
import Footer from "../componetn/Footer";
import Home from "../page/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute"; // Assuming ProtectedRoute.jsx is in src/router/

function Layout() {
  return (
    <>
      <Nav />
      <div className=" h-13 lg:h-16"></div>
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Login page typically doesn't need main Nav/Footer
  },
  {
    path: "/register",
    element: <Register />, // Register page also typically standalone
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
