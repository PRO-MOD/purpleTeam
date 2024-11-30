
import React, { useState, useEffect, useContext } from 'react';
import Switch from 'react-switch';
import FontContext from '../../context/FontContext';
const BT = import.meta.env.VITE_BT;
const WT= import.meta.env.VITE_WT;

const AccessSettings = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

  const [team, setTeam] = useState(BT); // Default to 'BT', update based on your requirement
  const [visibilitySettings, setVisibilitySettings] = useState({});

  useEffect(() => {
    fetchVisibilitySettings();
  }, [team]); // Fetch settings whenever the team changes

  const fetchVisibilitySettings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/config/getVisibilitySettings/${team}`, {
        method: 'GET',
      });
      const data = await response.json();
      setVisibilitySettings(data.settings || {});
    } catch (error) {
      console.error('Error fetching visibility settings:', error);
    }
  };

  const handleToggleChange = async (section) => {
    const newVisibility = visibilitySettings[section] === 'yes' ? 'no' : 'yes';
    setVisibilitySettings((prev) => ({ ...prev, [section]: newVisibility }));

    try {
      await fetch(`${apiUrl}/api/config/setVisibilitySettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team, section, visibility: newVisibility }),
      });
    } catch (error) {
      console.error('Error updating visibility settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm">
        <label className="font-semibold text-lg text-gray-700" style={{fontFamily: paraFont}}>
          Select Team
        </label>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="form-select mt-1 block w-full"
          style={{fontFamily: paraFont}} >
          <option value={BT}>BT</option>
          <option value={WT}>WT</option>
        </select>
      </div>
      {Object.keys(visibilitySettings).map((section) => (
        <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm" key={section}>
          <label className="font-semibold text-lg text-gray-700" style={{fontFamily: paraFont}}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </label>
          <Switch
            onChange={() => handleToggleChange(section)}
            checked={visibilitySettings[section] === 'yes'}
            onColor="#10B981" // Tailwind green-500
            offColor="#EF4444" // Tailwind red-500
            checkedIcon={false}
            uncheckedIcon={false}
            height={24}
            width={52}
            handleDiameter={22}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          />
        </div>
      ))}
    </div>
  );
};

export default AccessSettings;
