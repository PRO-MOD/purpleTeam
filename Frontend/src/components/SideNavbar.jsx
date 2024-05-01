import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser, faSignOutAlt, faNotesMedical, faComment } from "@fortawesome/free-solid-svg-icons";
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

  const isActive = (route) => {
    return window.location.href.includes(route);
  }

  return (
    <div className="flex flex-col h-screen bg-white-800 text-black w-full sticky top-0 shadow-xl z-50">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-4 px-2">
        <img src="https://hacktify.in/wp-content/uploads/2023/10/logo-1-min.png" alt="Logo" className="" />
        {/* <p className="mt-2 mx-2 text-lg font-bold uppercase invisible lg:visible">Hacktify</p> */}
      </div>
      <hr className="mx-2" />

      {/* Navigation Section */}
      <div className="flex-1 text-center">
        <ul>
          {userRole === "BT" && (
            <>
              <Link to="/UserHome" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/UserHome") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleUser} size="xl" />
                </div>
                <p className="mt-2 text-sm">UserHome</p>
              </Link>
              <Link to="/notes" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/notes") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faNotesMedical} size="xl" />
                </div>
                <p className="mt-2 text-sm">Notes</p>
              </Link>
              <Link to="/profile" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/profile") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} color="" size="xl" />
                </div>
                <p className="mt-2 text-sm">Account</p>
              </Link>
               {/* <Link to="/flag" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/flag") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faNotesMedical} size="xl" />
                </div>
                <p className="mt-2 text-sm">flag</p>
              </Link> */}

            </>
          )}
          {userRole === "WT" && (
            <>
              <Link to="/home" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/home") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHome} size="xl" className="" />
                </div>
                <p className="mt-2 text-sm">Home</p>
              </Link>
              <Link to="/createuser" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/createuser") ? "bg-gray-700 text-white" : ""}`}>
                <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} color="#1f2937" size="lg" />
                </div>
                <p className="mt-2 text-sm">Create User</p>
              </Link>
              <Link to="/assignTeams" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/assignTeams") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCalendar} size="2xl" />
                </div>
                <p className="mt-2 text-sm">View All</p>
              </Link>
              <Link to="/scores" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/scores") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRankingStar} size="2xl" />
                </div>
                <p className="mt-2 text-sm">Scores</p>
              </Link>
              {/*  */}
            </>
          )}
        </ul>
        <Link to="/chat" className={`flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ${isActive("/chat") ? "bg-gray-700 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faComment} size="xl" />
                </div>
                <p className="mt-2 text-sm">Chats</p>
              </Link>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center p-4 hover:bg-gray-700 hover:text-white">
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
