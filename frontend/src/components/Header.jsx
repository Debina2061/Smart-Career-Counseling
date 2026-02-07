import React from "react";
import { Link } from "react-router-dom";
function Header() {
  return (
    <>
      <header className="bg-white text-gray-900 flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-200 sticky top-0 z-40">
        {/* Logo */}
        <h2 className="text-xl font-bold tracking-tight">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Career</span>
        </h2>

        <div className="flex items-center gap-4">
          <Link
            to={"/signin"}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
          <Link
            to={"/signup"}
            className="px-5 py-2 rounded-lg text-sm text-white font-medium
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:shadow-lg transition"
          >
            Sign Up
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
