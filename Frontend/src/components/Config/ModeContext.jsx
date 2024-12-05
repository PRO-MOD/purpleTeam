import React, { createContext, useState, useContext, useEffect } from 'react';

// Create ModeContext
const ModeContext = createContext();

// Create a provider component
export const ModeProvider = ({ children }) => {
  const api = import.meta.env.VITE_Backend_URL;
  const apiUrl = `${api}/api/config/mode`;
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current mode when the provider mounts
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

  // Function to toggle mode
  const toggleMode = async () => {
    const newMode = mode === 'purpleTeam' ? 'ctfd' : 'purpleTeam';
    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
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
    <ModeContext.Provider value={{ mode, toggleMode, loading }}>
      {children}
    </ModeContext.Provider>
  );
};

// Custom hook to use the ModeContext
export const useMode = () => useContext(ModeContext);
