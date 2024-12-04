

import React, { useState, useEffect, useContext } from 'react';
import ColorContext from '../context/ColorContext';
import FontContext from '../context/FontContext';

const UserProfile = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [userData, setUserData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);

  useEffect(() => {
    // Fetch recent data when component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-token": localStorage.getItem('Hactify-Auth-token')
        },
      });
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleProfilePictureChange = (event) => {
    // Update the state with the selected file
    setNewProfilePicture(event.target.files[0]);
  };

  const handleProfilePictureSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', newProfilePicture);

      // Send the new profile picture to the backend
      await fetch(`${apiUrl}/api/auth/change-picture`, {
        method: 'POST',
        headers: {
            "Auth-token": localStorage.getItem('Hactify-Auth-token')
          },
        body: formData,
      });

      // Refresh user data to reflect the changes
      fetchUserData();

      // Reset the state
      setNewProfilePicture(null);
    } catch (error) {
      console.error('Error changing profile picture:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-xl bg-gray-100 rounded-lg shadow-md p-8"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
      <h1 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>User Profile</h1>
      <div className="flex flex-col items-center mb-8">
        {/* Display current profile picture */}
        <img src={` ${apiUrl}/${ userData.profile}` || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Profile" className="w-32 h-32 rounded-full mb-4 shadow-md" />
        <p className="mb-2"><span className="font-semibold"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>Name:</span> <span  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{userData.name}</span></p>
        <p className="mb-4"><span className="font-semibold"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>Email:</span> <span  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{userData.email}</span></p>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>Change Profile Picture:</h2>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <label htmlFor="profilePicture" className="cursor-pointer  text-white py-2 px-4 rounded-lg hover:bg-brown-650 transition duration-300 ease-in-out transform hover:scale-105" style={{backgroundColor:sidenavColor}}>Choose File</label>
          <input type="file" accept="image/*" id="profilePicture" className="hidden" onChange={handleProfilePictureChange} />
          <button onClick={handleProfilePictureSubmit} className=" text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" style={{backgroundColor:sidenavColor}}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
