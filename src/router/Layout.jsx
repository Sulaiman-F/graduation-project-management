import { Outlet } from "react-router";
import Nav from "../componetn/Nav";
import Footer from "../componetn/Footer";

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

export default Layout;
