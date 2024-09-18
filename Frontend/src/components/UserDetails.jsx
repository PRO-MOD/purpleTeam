
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UserReports from './UserReports';
import SubmissionTable from './Challenges/Submissions/submission';
import ReportDataVisualization from './DataVisualization/reportDataVisualization';
import ChallengesDataVisualization from './DataVisualization/challengesDataVisualization';


function UserDetails() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [submissionData, setSubmissionData]=useState(null);
  const [submissionTypes, setSubmissionTypes]=useState(null);
  const[mode,setMode]=useState("purpleTeam");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUserReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/responses/all/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          throw new Error('Failed to fetch user reports');
        }
      } catch (error) {
        console.error('Error fetching user reports:', error);
      }
    };

    const fetchUserScore = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/score/score/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setScoreData(data);
        } else {
          throw new Error('Failed to fetch user score');
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
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


    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/submissions/userSubmissions/${userId}`);
        const data = await response.json();
        setSubmissionData(data);
      } catch (error) {
        console.error('Error fetching submissions data:', error);
      }
    };

    const fetchSubmissionTypesCount = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/submissions/types-count/${userId}`);
        const data = await response.json();
        setSubmissionTypes(data);
      } catch (error) {
        console.error('Error fetching submission types count:', error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchUserReports();
      fetchUserScore();
      fetchMode();
      fetchSubmissions();
      fetchSubmissionTypesCount();
    }
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={handleGoBack} className="text-blue-500 hover:text-blue-700 underline flex flex-row justify-center items-center my-8">
        <FontAwesomeIcon icon={faArrowLeft} className='me-4' /> Back
      </button>
      <h1 className="text-3xl font-bold mb-4">User Details</h1>
      {user ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className='flex flex-row'>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <p className="text-gray-700">{user.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <p className="text-gray-700">{user.email}</p>
              </div>
            </div>
          </div>
     {mode==='purpleTeam' &&(
          <ReportDataVisualization jsonData={jsonData} scoreData={scoreData} />

        )}
          <ChallengesDataVisualization submissionData={submissionData} submissionTypes={submissionTypes} />
      
 

         { mode=='purpleTeam' &&(  <UserReports userId={userId} /> )}
<br/>
         <h1 className="text-3xl font-bold mb-4">Challenges Submissions</h1>
          <SubmissionTable userId={userId}/> 
        </div> 
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserDetails;
