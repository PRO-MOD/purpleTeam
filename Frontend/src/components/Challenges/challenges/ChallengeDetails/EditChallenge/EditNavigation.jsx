import React, { useState } from 'react';

const EditNavigation = ({activeTab, setActiveTab, tabs}) => {
  // const [activeTab, setActiveTab] = useState('Files');

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
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default EditNavigation;
