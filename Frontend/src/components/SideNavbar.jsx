


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


const SideNavbar = () => {
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState();
  const [logoUrl, setLogoUrl] = useState(null);
  const[mode,setMode]=useState("purpleTeam");
  const [visibilitySettings, setVisibilitySettings] = useState({});
  const navigate = useNavigate();
  const { creteSocket, unreadMessages, fetchUnreadMessages } = useContext(SocketContext);


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

  return (
    <div className="flex flex-col h-screen bg-white-600 text-white w-full sticky top-0 shadow-xl z-50 font-serif">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 h-32">
        <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
      </div>
      <hr className="mx-2" />

      {/* Navigation Section */}
      <div className="flex-1 text-center">
        <ul className="space-y-1">
          { mode==='purpleTeam'&&userRole && visibilitySettings.dashboard === 'yes' && (
            <Link to="/UserHome" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/UserHome") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faCircleUser} size="xl" className="mr-4" />
              <p className="text-lg">Dashboard</p>
            </Link>
          )}
          {userRole && visibilitySettings.notes === 'yes' && (
            <Link to="/notes" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/notes") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faNotesMedical} size="xl" className="mr-4" />
              <p className="text-lg">Notes</p>
            </Link>
          )}
          { userRole && visibilitySettings.progress === 'yes' && (
            <Link to="/progress" className={`flex items-center py-2 px-2  hover:text-white ${isActive("/progress") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faChartColumn} size="xl" className="mr-4" />
              <p className="text-lg">Progress</p>
            </Link>
          )}
          {userRole && visibilitySettings.notification === 'yes' && (
            <Link to="/attacks" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/attacks") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faShieldHalved} size="xl" className="mr-4" />
              <p className="text-lg">Notification</p>
            </Link>
          )}
          { userRole && visibilitySettings.home==='yes' && (
           
              <Link to="/home" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/home") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
                <FontAwesomeIcon icon={faHome} size="xl" className="mr-4" />
                <p className="text-lg">Home</p>
              </Link>
          )}
           {userRole && visibilitySettings.users==='yes' && (
              <Link to="/createuser" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/createuser") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
                <FontAwesomeIcon icon={faUserPlus} size="xl" className="mr-4" />
                <p className="text-lg">Users</p>
              </Link>
           )}
            {userRole && visibilitySettings.viewAll==='yes' && (
              <Link to="/assignTeams" className={`flex items-center py-2 px-2  hover:text-white ${isActive("/assignTeams") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
                <FontAwesomeIcon icon={faCalendar} size="xl" className="mr-4" />
                <p className="text-lg">View All</p>
              </Link>
            )}
             {userRole && visibilitySettings.submissions==='yes' &&(
              <Link to="/submissions" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/submissions") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
                <FontAwesomeIcon icon={faFile} size="xl" className="mr-4" />
                <p className="text-lg">Submissions</p>
              </Link>
             )}
             {userRole && visibilitySettings.score==='yes' && (
              <Link to="/scores" className={`flex items-center py-2 px-2  hover:text-white ${isActive("/scores") ? `text-white` : ""}`}  style={{ backgroundColor: isActive("/scores") ? hoverColor : sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isActive("/scores")
            ? hoverColor
            : sidenavColor}>
                <FontAwesomeIcon icon={faRankingStar} size="xl" className="mr-4" />
                <p className="text-lg">Scores</p>
              </Link>
             )}
               {mode==='purpleTeam'&&userRole && visibilitySettings.newReports==='yes' && (
              <Link to="/updates" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/updates") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
                <FontAwesomeIcon icon={faFilePdf} size="xl" className="mr-4" />
                <p className="text-lg">New Reports</p>
              </Link>
               )}

{mode==='purpleTeam'&& userRole && visibilitySettings.reportConfig ==='yes' && (
            <Link to={userRole === "WT" ? "/admin/report" : "/report"} className={`flex items-center py-2 px-2  hover:text-white ${isActive(userRole === "WT" ? "/admin/report" : "/report") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
             <FontAwesomeIcon icon={faWrench} size="xl" className="mr-4" />
              <p className="text-lg">Report Config</p>
            </Link>
)}

              {/* <Link to={userRole === "WT" ? "/admin/report" : "/report"} className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive(userRole === "WT" ? "/admin/report" : "/report") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faWrench} size="xl" className="mr-4" />
                <p className="text-lg">{userRole === "WT" ? "Admin Report" : "Report"}</p>
              </Link>
   */}
          {userRole && visibilitySettings.challenges === 'yes' && (
            <>
              <Link to={userRole === "WT" ? "/admin/challenges" : "challenges"} className={`flex items-center py-2 px-2  hover:text-white ${isActive(userRole === "WT" ? "/admin/challenges" : "challenges") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
             <FontAwesomeIcon icon={faPuzzlePiece} size="xl" className="mr-4" />
              <p className="text-lg">Challenges</p>
              </Link>
            </>
          )}

{userRole==='WT' && visibilitySettings.config === 'yes' && (
  <>
           <Link to="/config" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/config") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
           onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
           onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faCog} size="xl" className="mr-4" />             <p className="text-lg">Config</p>
           </Link>
           <Link to={`/challenges/docker`} className={`flex items-center py-2 px-2  hover:text-white ${isActive('/challenges/docker') ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
           onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
           onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
          <FontAwesomeIcon icon={faPuzzlePiece} size="xl" className="mr-4" />
           <p className="text-lg">Docker Manager</p>
           </Link>
  </>

          )}
          {userRole && visibilitySettings.profile === 'yes' && (
            <Link to="/profile" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/profile") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faUser} size="xl" className="mr-4" />
              <p className="text-lg">Profile</p>
            </Link>
          )}
          {userRole && visibilitySettings.communication === 'yes' && (
            <Link to="/chat" className={`flex items-center py-2 px-2 hover:text-white ${isActive("/chat") ? " text-white" : ""}`}  style={{ backgroundColor: sidenavColor }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
              <FontAwesomeIcon icon={faComment} size="xl" className="mr-4" />
              <p className="text-lg">Communication</p>
            </Link>
          )}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="flex items-center justify-center w-full py-2  text-white  rounded"  style={{ backgroundColor: sidenavColor }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverColor}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = sidenavColor}>
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="mr-2" />
          <p className="text-lg">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
