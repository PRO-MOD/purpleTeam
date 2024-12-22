import React from 'react';
import { useContext } from 'react';
import FontContext from '../../context/FontContext';
import ColorContext from '../../context/ColorContext';

const NavBar = ({ activeSection, setActiveSection }) => {
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  return (
    <div className="bg-gray-100 p-4 border-b" style={{backgroundColor: bgColor}}>
      <nav className="flex gap-8">
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'general' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('general')}
       style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
          General
        </button>
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'appearance' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('appearance')}
         style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
          Appearance
        </button>
        <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'access' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('access')}
         style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
          Access
        </button>
        {/* <button
          className={`text-left pb-2 border-b-2 ${activeSection === 'mode' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveSection('mode')}
         style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
          Mode
        </button> */}
      </nav>
    </div>
  );
};

export default NavBar;
