import React, { useState, useContext } from 'react';
import FontContext from '../../../../../context/FontContext';

const EditNavigation = ({ activeTab, setActiveTab, tabs }) => {
  const { navbarFont } = useContext(FontContext); // Access navbarFont from context

  return (
    <div className="border-b border-indigo-200 m-8">
      <nav className="flex flex-wrap space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-blue-500 ${
              activeTab === tab
                ? 'border-l border-t border-r border-indigo-200 border-b-0 bg-blue font-medium mb-[-1px] rounded-sm'
                : 'border-b border-transparent hover:border-indigo-300'
            }`}
            onClick={() => setActiveTab(tab)}
            style={navbarFont} // Apply navbarFont
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default EditNavigation;
