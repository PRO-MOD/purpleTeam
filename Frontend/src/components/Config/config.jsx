import React, { useState } from 'react';
import PageHeader from '../Challenges/navbar/PageHeader';
import NavBar from './Navbar';
import GeneralSettings from './GeneralSettings';
import AppearanceSettings from './AppearanceSettings';
import AccessSettings from './AccessSettings';

const ConfigurationPage = () => {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <>
      <PageHeader pageTitle="Configuration" />
      <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Content Area */}
      <div className="p-8">
        {activeSection === 'general' && <GeneralSettings />}
        {activeSection === 'appearance' && <AppearanceSettings />}
        {activeSection === 'access' && <AccessSettings />}
      </div>
    </>
  );
};

export default ConfigurationPage;
