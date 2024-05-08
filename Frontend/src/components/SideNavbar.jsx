import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser, faSignOutAlt, faNotesMedical, faComment } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://13.233.214.116:5000/api/auth/getuser", {
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
    fetchUnreadMessages();
  }, []);


  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch("http://13.233.214.116:5000/api/chat/unread-messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-token": localStorage.getItem('Hactify-Auth-token')
        },
      });
      const userData = await response.json();
      setUnreadMessages(userData);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = () => {
    // Clear local storage and redirect to login page
    localStorage.removeItem('Hactify-Auth-token');
    navigate('/signin');
  };

  const isActive = (route) => {
    return window.location.href.includes(route);
  }

  return (
    <div className="flex flex-col h-screen bg-white-600 text-white w-full sticky top-0 shadow-xl z-50 font-serif">
      {/* Logo Section */}
      <div className="flex flex-row items-center justify-center py-4 px-0 ">
        <img src="\cyber .jpg" alt="Logo" className="" />
        {/* <p className=" text-orange  uppercase invisible lg:visible">Hacktify</p> */}
      </div>
      <hr className="mx-2" />

      {/* Navigation Section */}
      <div className="flex-1 text-center">
        <ul>
          {userRole === "BT" && (
            <>
              <Link to="/UserHome" className={`flex flex-row items-center justify-start py-4 px-0 hover:bg-brown-450 hover:text-white ${isActive("/UserHome") ? "bg-brown-450 text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faCircleUser} size="xl" />
                </div>
                <p className="text-lg text-white">Dashboard</p>
              </Link>
              <Link to="/notes" className={`flex flex-row items-center justify-start py-4 px-0 hover:bg-brown-450  hover:text-white ${isActive("/notes") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faNotesMedical} size="xl" />
                </div>
                <p className="text-lg">Notes</p>
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
              <Link to="/home" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/home") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faHome} size="xl" className="" />
                </div>
                <p className="text-lg">Home</p>
              </Link>
              <Link to="/createuser" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/createuser") ? "bg-brown-450  text-white" : ""}`}>
                <div className="px-2">
                  <FontAwesomeIcon icon={faUserPlus} color="" size="xl" />
                </div>
                <p className="text-lg">Create User</p>
              </Link>
              <Link to="/assignTeams" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/assignTeams") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faCalendar} size="xl" />
                </div>
                <p className=" text-lg">View All</p>
              </Link>
              <Link to="/scores" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/scores") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faRankingStar} size="xl" />
                </div>
                <p className="text-lg">Scores</p>
              </Link>
            </>
          )}
        </ul>
        <Link to="/chat" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/chat") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faComment} size="xl" />
                </div>
                <p className=" text-md flex flex-row items-center flex-wrap">Communicate <span className="px-2 ms-2 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-green-400">{unreadMessages ? unreadMessages.unreadMessagesCount : ""}</span></p>
              </Link>
              <Link to="/profile" className={`flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white ${isActive("/profile") ? "bg-brown-450  text-white" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center px-2">
                  <FontAwesomeIcon icon={faUser} color="" size="xl" />
                </div>
                <p className=" text-lg">Profile</p>
              </Link>
        <button onClick={handleLogout} className="w-[100%] flex flex-row items-center justify-start px-0 py-4 hover:bg-brown-450  hover:text-white">
          <div className="h-10 flex items-center justify-center px-2">
            <FontAwesomeIcon icon={faSignOutAlt} className="rotate-180" size="xl" />
          </div>
          <p className="text-lg">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;