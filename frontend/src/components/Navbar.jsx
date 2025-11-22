import React from "react";

const Navbar = () => {
  return (
    <nav className="nav-glass px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-skinSage flex items-center justify-center text-xs font-semibold text-skinDeep">
          SS
        </div>
        <span className="font-semibold tracking-wide text-skinDeep">
          SkinSense AI
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-skinDeep/80">
        <a href="#step-1" className="hover:text-skinDeep">
          Scan
        </a>
        <a href="#step-3" className="hover:text-skinDeep">
          Profile
        </a>
        <a href="#step-4" className="hover:text-skinDeep">
          Routine
        </a>
        <a href="#step-5" className="hover:text-skinDeep">
          Products
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
