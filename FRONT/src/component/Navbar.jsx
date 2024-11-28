import React from "react";
import { Link } from "react-router-dom";
import FNAC from "../assets/FNAC.png";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
  ];

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center space-x-12">
        <Link to="/" className="flex items-center">
          <img src={FNAC} alt="Logo Fnac" className="h-12" />
        </Link>
      </div>

      <nav className="flex items-center space-x-10">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => (window.location.href = link.path)}
            className="relative group text-black no-underline"
          >
            {link.name}
            <span className="absolute left-0 bottom-[-2px] h-[2px] bg-black w-0 group-hover:w-full transition-all duration-200 ease-in-out" />
          </button>
        ))}
      </nav>
    </div>
  );
};
export default Navbar;