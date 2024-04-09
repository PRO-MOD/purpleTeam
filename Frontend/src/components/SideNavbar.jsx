import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-token": localStorage.getItem('Hactify-Auth-token')
          },
        });
        const userData = await response.json();
        setUserRole(userData.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    // Clear local storage and redirect to login page
    localStorage.removeItem('Hactify-Auth-token');
    navigate('/signin');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white w-full sticky top-0 shadow-xl shadow-black z-50">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-4 px-2">
        <img src="/Cyber_Abhyaas.png" alt="Logo" className="" />
        <p className="mt-2 mx-2 text-lg font-bold uppercase invisible lg:visible">Hacktify</p>
      </div>
      <hr className="mx-2" />

      {/* Navigation Section */}
      <div className="flex-1 text-center">
        <ul>
          {userRole === "BT" && (
            <>
              <Link to="/UserHome" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleUser} color="" size="xl" />
                </div>
                <p className="mt-2 text-sm">UserHome</p>
              </Link>
            </>
          )}
          {userRole === "WT" && (
            <>
              <Link to="/home" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHome} size="xl" className="" />
                </div>
                <p className="mt-2 text-sm">Home</p>
              </Link>
              <Link to="/createuser" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} color="#1f2937" size="lg" />
                </div>
                <p className="mt-2 text-sm">Create User</p>
              </Link>
              <Link to="/assignTeams" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCalendar} size="2xl" />
                </div>
                <p className="mt-2 text-sm">View All</p>
              </Link>
              <Link to="/scores" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRankingStar} size="2xl" />
                </div>
                <p className="mt-2 text-sm">Scores</p>
              </Link>
              <Link to="/profile" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} color="" size="xl" />
                </div>
                <p className="mt-2 text-sm">Account</p>
              </Link>
            </>
          )}
        </ul>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center mx-4 py-4 hover:bg-gray-700 hover:text-white">
          <div className="h-10 w-10 flex items-center justify-center">
            <FontAwesomeIcon icon={faSignOutAlt} className="rotate-180" size="2xl" />
          </div>
          <p className="mt-2 text-sm">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
