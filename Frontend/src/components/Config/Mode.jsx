import React, { useState, useEffect } from 'react';

function ModeSelector() {
  const api = import.meta.env.VITE_Backend_URL;
  const apiUrl = `${api}/api/config/mode`;
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current mode when the component mounts
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setMode(data.mode);
        } else {
          console.error('Failed to fetch mode');
        }
      } catch (error) {
        console.error('Error fetching mode:', error);
      }
    };

    fetchMode();
  }, []);

  // Handle mode change
  const handleToggle = async () => {
    const newMode = mode === 'purpleTeam' ? 'ctfd' : 'purpleTeam';
    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode: newMode }),
      });

      if (response.ok) {
        setMode(newMode);
        console.log('Mode updated successfully');
      } else {
        console.error('Failed to update mode');
      }
    } catch (error) {
      console.error('Error updating mode:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mode-toggle-container">
      <h2 className="text-lg font-medium mb-2">Mode: {mode === 'purpleTeam' ? 'Purple Team' : 'CTFD'}</h2>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300 ease-in-out ${
          mode === 'purpleTeam' ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
            mode === 'purpleTeam' ? 'translate-x-1' : 'translate-x-6'
          }`}
        />
      </button>
      {loading && <p className="mt-2 text-gray-500">Updating mode...</p>}
    </div>
  );
}

export default ModeSelector;
