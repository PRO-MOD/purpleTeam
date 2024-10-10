// Dropdown.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = ({ icon, title, items, isActive, hoverColor, sidenavColor, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center py-2 px-2 w-full text-left hover:text-white ${isOpen ? 'text-white' : ''}`}
        style={{ backgroundColor: isOpen ? hoverColor : sidenavColor }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = isOpen ? hoverColor : sidenavColor}
      >
        <FontAwesomeIcon icon={icon} size="xl" className="mr-4" />
        <p className="text-lg">{title}</p>
        <svg className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="ml-8 space-y-1">
          {items.filter(item => item.visibility && (userRole === 'WT' || !item.restricted)).map((item, index) => ( // Filter by visibility and role
            <Link key={index} to={item.path} className={`block py-2 px-4 hover:text-white ${isActive(item.path) ? 'text-white' : 'text-white'}`}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
