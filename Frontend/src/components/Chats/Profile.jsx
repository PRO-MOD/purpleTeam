import React, { useContext, useEffect, useState } from 'react';
import { Avatar } from 'react-chat-elements';
import AuthContext from '../../context/AuthContext';

function Profile() {
  const context = useContext(AuthContext);
  const { user, fetchUserRole } = context;
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        await fetchUserRole();
      } catch (error) {
        setError('Error fetching user role');
      }
    };

    getUserRole();
  }, []);

  return (
    <div className="flex flex-col items-center py-8 mx-auto bg-white">
      <Avatar
        src={user.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="avatar"
        size="xlarge"
        type="rounded"
        className="rounded-full"
      />
      <h1>Username: {user && user.name}</h1>
      <h1>Email: {user && user.email}</h1>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Profile;
