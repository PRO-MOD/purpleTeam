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
    <div className="flex flex-col h-screen bg-white-600 text-gray w-full sticky top-0 shadow-xl z-50 font-serif">
      {/* Logo Section */}
      <div className="flex flex-row items-center justify-center py-4 px-4 ">
        <img src="https://hacktify.in/wp-content/uploads/2023/10/logo-1-min.png" alt="Logo" className="h-16 mr-2 pb-2" />
        <p className=" text-orange  uppercase invisible lg:visible">Hacktify</p>
      </div>
      <hr className="mx-2" />

      {/* Navigation Section */}
      <div className="flex-1 text-center">
        <ul>
          {userRole === "BT" && (
            <>
              <Link to="/UserHome" className={`flex flex-row items-center justify-start py-4 px-4 hover:bg-orange-100 hover:text-black ${isActive("/UserHome") ? "bg-orange-100 text-black" : ""}` }>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleUser} size="xl" />
                </div>
                <p className="text-lg">Home</p>
              </Link>
              <Link to="/notes" className={`flex flex-row items-center justify-start py-4 px-4 hover:bg-orange-100 hover:text-black ${isActive("/notes") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faNotesMedical} size="xl" />
                </div>
                <p className="text-lg">Notes</p>
              </Link>
              <Link to="/profile" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-black ${isActive("/profile") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} color="" size="xl" />
                </div>
                <p className=" text-lg">Account</p>
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
              <Link to="/home" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-black ${isActive("/home") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHome} size="xl" className="" />
                </div>
                <p className="text-lg">Home</p>
              </Link>
              <Link to="/createuser" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-black ${isActive("/createuser") ? "bg-orange-100 text-black" : ""}`}>
                <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} color="#1f2937" size="xl" />
                </div>
                <p className="text-lg">Create User</p>
              </Link>
              <Link to="/assignTeams" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-orange ${isActive("/assignTeams") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCalendar} size="xl" />
                </div>
                <p className=" text-lg">View All</p>
              </Link>
              <Link to="/scores" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-black ${isActive("/scores") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRankingStar} size="xl" />
                </div>
                <p className="text-lg">Scores</p>
              </Link>
              {/*  */}
            </>
          )}
        </ul>
        <Link to="/chat" className={`flex flex-row items-center justify-start px-4 py-4 hover:bg-orange-100 hover:text-black ${isActive("/chat") ? "bg-orange-100 text-black" : ""}`}>
                <div className="h-10 w-10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faComment} size="xl" />
                </div>
                <p className=" text-lg">Chats</p>
              </Link>
        <button onClick={handleLogout} className="flex flex-row items-center justify-start px-6 py-4 hover:bg-orange-100 hover:text-black">
          <div className="h-10 w-10 flex items-center justify-center">
            <FontAwesomeIcon icon={faSignOutAlt} className="rotate-180" size="xl" />
          </div>
          <p className="text-lg">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
