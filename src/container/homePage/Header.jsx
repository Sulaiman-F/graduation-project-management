import React from "react";

function Header() {
  return (
    <>
      <div
        className="flex items-center justify-center h-screen gap-5 bg-neutral-100 px-2"
        style={{
          backgroundImage: "url('ContourLine.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          className="hidden lg:block w-1/3 h-auto rounded-xl "
          src="gradient-insights-illustration.png"
          alt=""
        />
        <div className="flex flex-col items-center justify-center gap-5 w-full md:w-1/2 bg-neutral-100 bg-opacity-80 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-103">
          <h1 className="text-2xl font-bold text-center md:text-3xl">
            Welcome{" "}
            <span className="font-bold underline decoration-violet-500">
              {localStorage.getItem("username")}
            </span>
            ,
          </h1>
          <p className="w-full text-center text-md md:text-xl ">
            to the Graduation Project Management System — a platform designed to
            streamline the process of managing and submitting graduation project
            ideas. Stay organized, track progress, and collaborate effectively
            from start to finish.
          </p>
        </div>
      </div>
    </>
  );
}

export default Header;
