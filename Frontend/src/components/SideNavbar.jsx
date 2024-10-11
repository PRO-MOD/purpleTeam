import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser,
  faSignOutAlt, faNotesMedical, faComment, faChartColumn, faShieldHalved,
  faFilePdf, faPuzzlePiece, faWrench, faFile
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import SocketContext from '../context/SocketContext';
import ColorContext from "../context/ColorContext";
import Dropdown from './Partials/Dropdown'; // Import the Dropdown component
import FontContext from "../context/FontContext";

const SideNavbar = () => {
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState();
  const [logoUrl, setLogoUrl] = useState(null);
  const [mode, setMode] = useState("purpleTeam");
  const [visibilitySettings, setVisibilitySettings] = useState({});
  const navigate = useNavigate();
  const { creteSocket, fetchUnreadMessages } = useContext(SocketContext);

  useEffect(() => {
    fetchUserRole();
    fetchUnreadMessages();
    fetchLogoUrl();
    fetchMode();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchVisibilitySettings(userRole);
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-token": localStorage.getItem('Hactify-Auth-token')
        },
      });
      const userData = await response.json();
      setUserId(userData._id);
      setUserRole(userData.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchLogoUrl = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/config/eventDetails`, {
        method: 'GET',
      });
      const data = await response.json();
      setLogoUrl(`${apiUrl}${data.url}`);
    } catch (error) {
      console.error('Error fetching logo URL:', error);
    }
  };

  const fetchMode = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/config/mode`, {
        method: 'GET',
      });
      const data = await response.json();
      setMode(data.mode);
    } catch (error) {
      console.error('Error fetching mode:', error);
    }
  };

  const fetchVisibilitySettings = async (team) => {
    try {
      const response = await fetch(`${apiUrl}/api/config/getVisibilitySettings/${team}`, {
        method: 'GET',
      });
      const data = await response.json();
      setVisibilitySettings(data.settings);
    } catch (error) {
      console.error('Error fetching visibility settings:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      creteSocket(userId);
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('Hactify-Auth-token');
    navigate('/signin');
  };

  const isActive = (route) => {
    return window.location.pathname === route;
  };

  // Define categories with their items
  const categories = [
    {
      title: "User Management",
      icon: faUserPlus,
      restricted: true, // Restricted to userRole === "WT"
      items: [
        { path: "/createuser", label: "Users", visibility: visibilitySettings.users },
        { path: "/assignTeams", label: "View All", visibility: visibilitySettings.viewAll },
      ],
    },
    {
      title: "Submissions & Scores",
      icon: faFile,
      restricted: true, // Restricted to userRole === "WT"
      items: [
        { path: "/submissions", label: "Submissions", visibility: visibilitySettings.submissions },
        { path: "/scores", label: "Scores", visibility: visibilitySettings.score },
        { path: "/updates", label: "New Reports", visibility: visibilitySettings.newReports },
      ],
    },
    {
      title: "Challenges",
      icon: faPuzzlePiece,
      restricted: false, // Accessible to all
      items: [
        { path: userRole === "WT" ? "/admin/challenges" : "/challenges", label: "Challenges", visibility: visibilitySettings.challenges },
        
        { path: "/repository", label: "Repository", visibility: userRole === "WT"  },
        { path: "/challenges/docker", label: "Docker Manager", visibility: userRole === "WT" && visibilitySettings.challenges },
      ],
    },
    {
      title: "Configurations & Reports",
      icon: faWrench, // You can use a suitable icon here
      restricted: true,
      items: [
        { path: "/config", label: "Configurations", visibility: visibilitySettings.config },
        { path: userRole === "WT" ? "/admin/report" : "/report", label: "Report Config", visibility: visibilitySettings.reportConfig },
      ],
    },
  ];
  

  // Define general items
  const generalItems = [
    { path: "/UserHome", icon: faCircleUser, label: "Dashboard", visibility: visibilitySettings.dashboard },
    { path: "/notes", icon: faNotesMedical, label: "Notes", visibility: visibilitySettings.notes },
    { path: "/progress", icon: faChartColumn, label: "Progress", visibility: visibilitySettings.progress },
    { path: "/attacks", icon: faShieldHalved, label: "Notification", visibility: visibilitySettings.notification },
    { path: "/home", icon: faHome, label: "Home", visibility: visibilitySettings.home },
    { path: "/profile", icon: faUser, label: "Profile", visibility: visibilitySettings.profile },
    { path: "/chat", icon: faComment, label: "Communication", visibility: visibilitySettings.communication },
  ];

  return (
    <div className="flex flex-col h-screen bg-white-600 text-white w-full sticky top-0 shadow-xl z-50 overflow-y-auto" style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 h-32">
        <img src={logoUrl} alt="Logo" className="h-full" />
      </div>

      {/* Navigation Section */}
      <div className="flex-grow">
        <ul className="flex flex-col">
          {/* General Items */}
          {generalItems.map((item, index) => (
            item.visibility && (
              <Link key={index} to={item.path} className={`flex items-center p-2 mx-2 my-1 rounded-lg hover:text-white ${isActive(item.path) ? 'text-white' : 'text-white'}`} 
                style={{ backgroundColor: isActive(item.path) ? hoverColor : sidenavColor }}  
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isActive(item.path) ? hoverColor : sidenavColor;
                }}
                >
                <FontAwesomeIcon icon={item.icon} size="xl" className="mr-4" />
                <p className="text-lg" >{item.label}</p>
              </Link>
            )
          ))}

          {/* Categories Dropdowns */}
          {categories.map((category, index) => {
        // Check if the category is restricted and if the user has the appropriate role
        if (category.restricted && userRole !== "WT") {
          return null; // Skip this category if it's restricted and the user is not "WT"
        }

        // If the category is not restricted, render it
        return (
          <Dropdown
            key={index}
            title={category.title}
            icon={category.icon}
            items={category.items.filter(item => item.visibility)} // Filter items based on visibility
            isActive={path => window.location.pathname === path}
            hoverColor={hoverColor}// Example hover color
            sidenavColor={sidenavColor} // Example sidenav color
          />
        );
      })}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-4 fixed bottom-0">
        <button onClick={handleLogout} className="flex items-center py-2 px-2 hover:text-white" style={{ backgroundColor: sidenavColor }}>
          <FontAwesomeIcon icon={faSignOutAlt} size="xl" className="mr-4" />
          <p className="text-lg" >Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
