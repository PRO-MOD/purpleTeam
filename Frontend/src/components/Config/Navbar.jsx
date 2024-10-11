import React, {useContext} from 'react';
import ColorContext from '../../context/ColorContext';

const NavBar = ({ activeSection, setActiveSection }) => {
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  return (
    <div className="bg-gray-100 p-4 border-b" style={{backgroundColor: bgColor}}>
      <nav className="flex gap-8">
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'general' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('general')}
        >
          General
        </button>
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'appearance' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('appearance')}
        >
          Appearance
        </button>
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'access' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('access')}
        >
          Access
        </button>
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'mode' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('mode')}
        >
          Mode
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
