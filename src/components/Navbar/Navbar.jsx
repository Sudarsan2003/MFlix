import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdOutlineArrowDropDown, MdMenu, MdClose } from "react-icons/md";

const Navbar = ({ setSearchQuery }) => {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchQuery(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#141414] text-white sticky top-0 z-50">
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden mr-4 text-2xl">
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>

          <ul className={`lg:flex space-x-8 ${menuOpen ? "absolute top-16 left-0 w-full bg-[#141414] p-5" : "hidden lg:flex"}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}><li className="hover:text-gray-400">Home</li></Link>
            <Link to="/tvshows" onClick={() => setMenuOpen(false)}><li className="hover:text-gray-400">TV Shows</li></Link>
            <Link to="/movies" onClick={() => setMenuOpen(false)}><li className="hover:text-gray-400">Movies</li></Link>
            <Link to="/bylanguages" onClick={() => setMenuOpen(false)}><li className="hover:text-gray-400">Browse by Languages</li></Link>
            <Link to="/watchList" onClick={() => setMenuOpen(false)}><li className="hover:text-gray-400">Your Watchlist</li></Link>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
   
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow text-white bg-transparent outline-none"
              placeholder="Search"
              value={query}
              onChange={handleSearch}
            />
            <CiSearch className="h-5 w-5 text-white cursor-pointer" />
          </label>

          <FaBell className="size-7 cursor-pointer hover:text-gray-400" />

      
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <CgProfile className="size-8" />
              <MdOutlineArrowDropDown className={`size-8 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </div>

      
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                <ul className="py-2 text-sm">
                  <Link to="/login" onClick={() => setDropdownOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Sign In</li>
                  </Link>
                  <Link to="/registration" onClick={() => setDropdownOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Sign Up</li>
                  </Link>
                  <Link to='/profile'>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Profile</li>
                  </Link>
                  
                  <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-600 cursor-pointer text-red-400">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
