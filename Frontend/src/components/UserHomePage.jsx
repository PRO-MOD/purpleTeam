import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReportTable from './AllReports';


function ProjectDiv({ text, link, disableOnClick }) {
  return (
    <div className={`text-center p-6 bg-white shadow-md rounded-lg h-64 flex flex-col justify-between ${disableOnClick ? 'pointer-events-none opacity-50' : ''}`}>
      <Link to={link} className="cream-div flex justify-center items-center h-full">
        <div className="plus-sign block bg-blue-500 text-white rounded-full transition duration-300 ease-in-out hover:bg-blue-600 w-[50px] h-[50px] text-3xl text-center">
          +
        </div>
      </Link>
      <p className="text-sm mt-4">{text}</p>
    </div>
  );
}

export default function UserHomePage() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const projects = [
    { text: 'Add Day 1 Report Here ', link: '/report', disableOnClick: formSubmitted },
    { text: 'Add Day 2 Report Here', link: '/report', disableOnClick: formSubmitted },
    { text: 'Add Day 3 Report Here', link: '/report', disableOnClick: formSubmitted },
    // Add more projects as needed
  ];

  const handleFormSubmission = () => {
    setFormSubmitted(true); // Set formSubmitted to true after form submission
    alert('Response submitted successfully!');
    navigate('/');
  };

  return (
    <div className="bg-gray-100">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 py-4">Share your report</h1><hr className='mx-12 border-black'/>
      </div>
      <div className="flex flex-row justify-center items-center space-x-4 px-4 py-8">
        {/* {projects.map((project, index) => (
          <ProjectDiv key={index} text={project.text} link={project.link} disableOnClick={project.disableOnClick} />
        ))} */}
        <Link to='/UserHome/report/SITREP' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'><span className='mx-2'><FontAwesomeIcon icon={faPlus} /></span>Add SITREP Report</Link>
        <Link to='/UserHome/report/incident' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'><span className='mx-2'><FontAwesomeIcon icon={faPlus} /></span>Add Incident Response Report</Link>
      </div>
        <ReportTable/>
    </div>
  );
}
