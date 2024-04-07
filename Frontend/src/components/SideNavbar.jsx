import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faCalendar, faUserPlus, faRankingStar, faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom"

const SideNavbar = () => {
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
        <ul className="">
          {/* Profile Section */}
          <Link to="/" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
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
            <FontAwesomeIcon icon={faCalendar} size="2xl"/>
            </div>
            <p className="mt-2 text-sm">View All</p>
          </Link>
          <Link to="/scores" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
            <div className="h-10 w-10 flex items-center justify-center">
            <FontAwesomeIcon icon={faRankingStar} size="2xl"/>
            </div>
            <p className="mt-2 text-sm">Scores</p>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
            <div className="h-10 w-10 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} color="" size="xl" />
            </div>
            <p className="mt-2 text-sm">Account</p>
          </Link>
          <Link to="/UserHome" className="flex flex-col items-center justify-center py-4 hover:bg-gray-700 hover:text-white ">
            <div className="h-10 w-10 flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleUser} color="" size="xl" />
            </div>
            <p className="mt-2 text-sm">UserHome</p>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;
