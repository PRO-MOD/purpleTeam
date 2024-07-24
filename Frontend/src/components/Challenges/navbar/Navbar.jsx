import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 w-full sticky top-0 z-10">
      <div className="container flex items-center py-2 px-6 justify-between">
        <div className="text-white text-2xl font-bold pe-4">Hacktify</div>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className={`flex w-[90%] ${isOpen ? 'block' : 'hidden'} lg:flex`}>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-400 hover:text-white">Users</Link>
            <Link to="/" className="text-gray-400 hover:text-white">Teams</Link>
            <Link to="/userChallenges" className="text-gray-400 hover:text-white">Scoreboard</Link>
            <Link to="/challenge" className="text-gray-400 hover:text-white">Challenges</Link>
          </div>
          <div className="flex space-x-4 ms-auto">
            <Link to="/" className="text-gray-400 hover:text-white">Register</Link>
            <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
