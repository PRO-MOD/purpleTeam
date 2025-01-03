import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import ColorContext from '../../context/ColorContext';
import FontContext from '../../context/FontContext';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Array of links (using internal links with react-router-dom)
  const links = [
    { to: '/', text: 'Home' },
    { to: '/team', text: 'About' },
    { to: '/blog', text: 'Blog' },
    { to: '/signin', text: 'Get Started', className: "text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded",
     },
  ];

  return (
    <header id="top" className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          id="logo"
          to="/"
          className="flex-shrink-0 text-3xl font-extrabold" style={{color:sidenavColor}}
        >
          Crysalen
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'} md:block`}>
          <ul className={`flex flex-col md:flex-row md:space-x-6 transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden md:flex'}`}>
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className={`text-gray-700 hover:text-blue-600 ${link.className || ''}`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="flex space-x-4 hidden md:flex">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://www.linkedin.com/company/Crysalen/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://instagram.com/Crysalenco" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="text-gray-700 hover:text-blue-600" />
          </a>
        </div>
      </div>

      {/* Social Media Icons for Mobile */}
      {isOpen && (
        <div className="flex space-x-4 md:hidden justify-center mt-2">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://www.linkedin.com/company/Crysalen/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="text-gray-700 hover:text-blue-600" />
          </a>
          <a href="https://instagram.com/Crysalenco" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="text-gray-700 hover:text-blue-600" />
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
