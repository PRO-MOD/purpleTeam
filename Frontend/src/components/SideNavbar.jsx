

// import React, { useState, useEffect, useContext } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser, faSignOutAlt, faNotesMedical, faComment, faChartColumn, faShieldHalved, faFilePdf, faPuzzlePiece,faWrench, faFile } from "@fortawesome/free-solid-svg-icons";

// import { Link, useNavigate } from "react-router-dom";
// import SocketContext from '../context/SocketContext';

// const SideNavbar = () => {
//   const apiUrl = import.meta.env.VITE_Backend_URL;
//   const [userRole, setUserRole] = useState(null);
//   const [userId, setUserId] = useState();
//   const [logoUrl, setLogoUrl] = useState(null);
//   const [visibilitySettings, setVisibilitySettings] = useState({});
//   const navigate = useNavigate();

//   const { creteSocket, unreadMessages, fetchUnreadMessages } = useContext(SocketContext);

//   useEffect(() => {
//     fetchUserRole();
//     fetchUnreadMessages();
//     fetchLogoUrl();
//     fetchVisibilitySettings();
//   }, []);

//   const fetchUserRole = async () => {
//     try {
//       const response = await fetch(`${apiUrl}/api/auth/getuser`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Auth-token": localStorage.getItem('Hactify-Auth-token')
//         },
//       });
//       const userData = await response.json();
//       setUserId(userData._id);
//       setUserRole(userData.role);
//     } catch (error) {
//       console.error("Error fetching user role:", error);
//     }
//   };

//   const fetchLogoUrl = async () => {
//     try {
//       const response = await fetch(`${apiUrl}/api/config/eventDetails`, {
//         method: 'GET',
//       });
//       const data = await response.json();
//       setLogoUrl(`${apiUrl}${data.url}`);
//     } catch (error) {
//       console.error('Error fetching logo URL:', error);
//     }
//   };

//   const fetchVisibilitySettings = async () => {
//     try {
//       const response = await fetch(`${apiUrl}/api/config/getVisibilitySettings`, {
//         method: 'GET',
//       });
//       const data = await response.json();
//       setVisibilitySettings(data.settings);
//     } catch (error) {
//       console.error('Error fetching visibility settings:', error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       creteSocket(userId);
//     }
//   }, [userId])

//   const handleLogout = () => {
//     localStorage.removeItem('Hactify-Auth-token');
//     navigate('/signin');
//   };

//   const isActive = (route) => {
//     return window.location.href.includes(route);
//   }

//   return (
//     <div className="flex flex-col h-screen bg-white-600 text-white w-full sticky top-0 shadow-xl z-50 font-serif">
//       {/* Logo Section */}
//       <div className="flex items-center justify-center py-4 h-32">
//         <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
//       </div>
//       <hr className="mx-2" />

//       {/* Navigation Section */}
//       <div className="flex-1 text-center">
//         <ul className="space-y-1">
//           {userRole === "BT" && (
//             <>
//               {visibilitySettings.dashboard === 'yes' && (
//                 <Link to="/UserHome" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/UserHome") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faCircleUser} size="xl" className="mr-4" />
//                   <p className="text-lg">Dashboard</p>
//                 </Link>
//               )}
//               {visibilitySettings.notes === 'yes' && (
//                 <Link to="/notes" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/notes") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faNotesMedical} size="xl" className="mr-4" />
//                   <p className="text-lg">Notes</p>
//                 </Link>
//               )}
//               {visibilitySettings.progress === 'yes' && (
//                 <Link to="/progress" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/progress") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faChartColumn} size="xl" className="mr-4" />
//                   <p className="text-lg">Progress</p>
//                 </Link>
//               )}
//               {visibilitySettings.notification === 'yes' && (
//                 <Link to="/attacks" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/attacks") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faShieldHalved} size="xl" className="mr-4" />
//                   <p className="text-lg">Notification</p>
//                 </Link>
//               )}
//             </>
//           )}
//           {userRole === "WT" && (
//             <>
//               <Link to="/home" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/home") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faHome} size="xl" className="mr-4" />
//                 <p className="text-lg">Home</p>
//               </Link>
//               <Link to="/createuser" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/createuser") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faUserPlus} size="xl" className="mr-4" />
//                 <p className="text-lg">Users</p>
//               </Link>
//               <Link to="/assignTeams" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/assignTeams") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faCalendar} size="xl" className="mr-4" />
//                 <p className="text-lg">View All</p>
//               </Link>
//               <Link to="/submissions" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/submissions") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faFile} size="xl" className="mr-4" />
//                 <p className="text-lg">Submissions</p>
//               </Link>
//               <Link to="/scores" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/scores") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faRankingStar} size="xl" className="mr-4" />
//                 <p className="text-lg">Scores</p>
//               </Link>
//               <Link to="/updates" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/updates") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faFilePdf} size="xl" className="mr-4" />
//                 <p className="text-lg">New Reports</p>
//               </Link>
//               <Link to={userRole === "WT" ? "/admin/report" : "/report"} className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive(userRole === "WT" ? "/admin/report" : "/report") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faWrench} size="xl" className="mr-4" />
//                 <p className="text-lg">Report Config</p>
//               </Link>
//               <Link to="/config" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/config") ? "bg-brown-450 text-white" : ""}`}>
//                 <FontAwesomeIcon icon={faCog} size="xl" className="mr-4" />
//                 <p className="text-lg">Config</p>
//               </Link>
//             </>
//           )}
//           {(userRole === "WT" || (userRole === "BT" && visibilitySettings.challenges === 'yes')) && (
//             <Link to={userRole === "WT" ? "/admin/challenges" : "challenges"} className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive(userRole === "WT" ? "/admin/challenges" : "challenges") ? "bg-brown-450 text-white" : ""}`}>
//               <FontAwesomeIcon icon={faPuzzlePiece} size="xl" className="mr-4" />
//               <p className="text-lg">Challenges</p>
//             </Link>
//           )}
//           {(userRole === "WT" ||  ( userRole === "BT" && visibilitySettings.profile === 'yes' ))&&(
//                 <Link to="/profile" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/profile") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faUser} size="xl" className="mr-4" />
//                   <p className="text-lg">Profile</p>
//                 </Link>
//           )}

//       {(userRole === "WT" || (userRole === "BT" && visibilitySettings.communication === 'yes')) && (
//                 <Link to="/chat" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/chat") ? "bg-brown-450 text-white" : ""}`}>
//                   <FontAwesomeIcon icon={faComment} size="xl" className="mr-4" />
//                   <p className="text-lg">Communication</p>
//                   {unreadMessages > 0 && (
//                     <span className="ml-2 rounded-full bg-red-500 text-white text-sm font-semibold px-2 py-1">{unreadMessages}</span>
//                   )}
//                 </Link>
//       )}
         
//         </ul>
//       </div>
//       <div className="py-2">
//         <button
//           className="w-full flex items-center py-2 px-4 hover:bg-red-500 hover:text-white text-red-500"
//           onClick={handleLogout}
//         >
//           <FontAwesomeIcon icon={faSignOutAlt} size="xl" className="mr-2" />
//           <p className="text-lg">Logout</p>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SideNavbar;


import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser,
  faSignOutAlt, faNotesMedical, faComment, faChartColumn, faShieldHalved, 
  faFilePdf, faPuzzlePiece, faWrench, faFile
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import SocketContext from '../context/SocketContext';


const SideNavbar = () => {
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
    return window.location.href.includes(route);
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
            <Link to="/UserHome" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/UserHome") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faCircleUser} size="xl" className="mr-4" />
              <p className="text-lg">Dashboard</p>
            </Link>
          )}
          {userRole && visibilitySettings.notes === 'yes' && (
            <Link to="/notes" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/notes") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faNotesMedical} size="xl" className="mr-4" />
              <p className="text-lg">Notes</p>
            </Link>
          )}
          { userRole && visibilitySettings.progress === 'yes' && (
            <Link to="/progress" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/progress") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faChartColumn} size="xl" className="mr-4" />
              <p className="text-lg">Progress</p>
            </Link>
          )}
          {userRole && visibilitySettings.notification === 'yes' && (
            <Link to="/attacks" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/attacks") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faShieldHalved} size="xl" className="mr-4" />
              <p className="text-lg">Notification</p>
            </Link>
          )}
          { userRole && visibilitySettings.home==='yes' && (
           
              <Link to="/home" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/home") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faHome} size="xl" className="mr-4" />
                <p className="text-lg">Home</p>
              </Link>
          )}
           {userRole && visibilitySettings.users==='yes' && (
              <Link to="/createuser" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/createuser") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faUserPlus} size="xl" className="mr-4" />
                <p className="text-lg">Users</p>
              </Link>
           )}
            {userRole && visibilitySettings.viewAll==='yes' && (
              <Link to="/assignTeams" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/assignTeams") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faCalendar} size="xl" className="mr-4" />
                <p className="text-lg">View All</p>
              </Link>
            )}
             {userRole && visibilitySettings.submissions==='yes' &&(
              <Link to="/submissions" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/submissions") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faFile} size="xl" className="mr-4" />
                <p className="text-lg">Submissions</p>
              </Link>
             )}
             {userRole && visibilitySettings.score==='yes' && (
              <Link to="/scores" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/scores") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faRankingStar} size="xl" className="mr-4" />
                <p className="text-lg">Scores</p>
              </Link>
             )}
               {mode==='purpleTeam'&&userRole && visibilitySettings.newReports==='yes' && (
              <Link to="/updates" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/updates") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faFilePdf} size="xl" className="mr-4" />
                <p className="text-lg">New Reports</p>
              </Link>
               )}

{mode==='purpleTeam'&& userRole && visibilitySettings.reportConfig ==='yes' && (
            <Link to={userRole === "WT" ? "/admin/report" : "/report"} className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive(userRole === "WT" ? "/admin/report" : "/report") ? "bg-brown-450 text-white" : ""}`}>
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
              <Link to={userRole === "WT" ? "/admin/challenges" : "challenges"} className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive(userRole === "WT" ? "/admin/challenges" : "challenges") ? "bg-brown-450 text-white" : ""}`}>
                <FontAwesomeIcon icon={faPuzzlePiece} size="xl" className="mr-4" />
                  <p className="text-lg">Challenges</p>
                  </Link>
              <Link to="/challenges/docker" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/challenges/docker") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faComment} size="xl" className="mr-4" />
              <p className="text-lg">Docker</p>
            </Link>
            </>
          )}

{userRole==='WT' && visibilitySettings.config === 'yes' && (
           <Link to="/config" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/config") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faCog} size="xl" className="mr-4" />             
              <p className="text-lg">Config</p>
           </Link>
          )}
          {userRole && visibilitySettings.profile === 'yes' && (
            <Link to="/profile" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/profile") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faUser} size="xl" className="mr-4" />
              <p className="text-lg">Profile</p>
            </Link>
          )}
          {userRole && visibilitySettings.communication === 'yes' && (
            <Link to="/chat" className={`flex items-center py-2 px-2 hover:bg-brown-450 hover:text-white ${isActive("/chat") ? "bg-brown-450 text-white" : ""}`}>
              <FontAwesomeIcon icon={faComment} size="xl" className="mr-4" />
              <p className="text-lg">Communication</p>
            </Link>
          )}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="flex items-center justify-center w-full py-2 bg-brown-600 text-white hover:bg-brown-450 rounded">
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="mr-2" />
          <p className="text-lg">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
