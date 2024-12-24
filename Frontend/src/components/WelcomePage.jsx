
import React, { useState, useEffect,useContext } from 'react';
import FontContext from '../context/FontContext';
import ColorContext from '../context/ColorContext';

const Welcome = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    const [eventDetails, setEventDetails] = useState({
        url: '',
        title: '',
        description: ''
    });

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/config/eventDetails`);
                if (response.ok) {
                    const data = await response.json();
                    setEventDetails(data);
                } else {
                    console.error('Failed to fetch event details');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchEventDetails();
    }, []);

    const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  const fetchImage = async () => {
    try {
      const response = await fetch(`${apiUrl}${eventDetails.url}`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("Hactify-Auth-token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      // Convert response to a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  fetchImage();

  // Clean up the URL to avoid memory leaks
  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };
}, [eventDetails]);



    return (
        <div className="h-screen flex flex-col items-center bg-white -z-50"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize, backgroundColor: bgColor }}>
            {/* Header */}
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow p-8">
                {/* <img 
                    src={`${apiUrl}${eventDetails.url}` ||"\Cyber Suraksha.png" } 
                    alt="Logo" 
                    className="w-128 h-64 mb-8" 
                /> */}
                 <img
    src={imageUrl}
    alt="Logo"
    className="w-128 h-64 mb-8"
  />
                <h2 className="text-3xl font-bold text-gray-800 mb-4"  style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>
                    {eventDetails.title || 'Defend the Flag'}
                </h2>
                <p className="text-gray-600 text-center max-w-lg"   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
                    {eventDetails.description || 'Welcome to the Crysalen Platform! Our mission is to empower you with the skills and knowledge to protect and defend against cyber threats. Join us in our journey to a safer digital world.'}
                </p>
            </div>
            {/* Footer */}
            <footer className="text-center text-red-500 text-lg mt-16"   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
                Powered By Hacktify
            </footer>
        </div>
    );
};

export default Welcome;
