
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UserReports from './UserReports';
import SubmissionTable from './Challenges/Submissions/submission';
import ReportDataVisualization from './DataVisualization/reportDataVisualization';
import ChallengesDataVisualization from './DataVisualization/challengesDataVisualization';
import StaticScore from './StaticScore';
import FontContext from '../context/FontContext';

function UserDetails() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [submissionTypes, setSubmissionTypes] = useState(null);
  const [mode, setMode] = useState("purpleTeam");
  const [selectedTab, setSelectedTab] = useState('reports'); // New state for tab selection
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
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: headingFont }}>User Details</h1>
      {user ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className='flex flex-row'>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>Name:</label>
                <p className="text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{user.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>Email:</label>
                <p className="text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{user.email}</p>
              </div>
            </div>
          </div>
          <br/>
<div >
{<StaticScore userId={userId}/>}
</div>
         

          {/* Show challenges content directly if mode is 'ctfd' */}
          {mode === 'ctfd' ? (
            <>
              <ChallengesDataVisualization submissionData={submissionData} submissionTypes={submissionTypes} />
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: headingFont }}>Challenges Submissions</h1>
              <SubmissionTable userId={userId} />
            </>
          ) : (
            <>
              {/* Buttons for switching between Reports and Challenges */}
              <div className="flex justify-center space-x-4 my-6">
                <button
                  onClick={() => setSelectedTab('reports')}
                  className={`px-4 py-2 mr-2 ${selectedTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Reports
                </button>
                <button
                  onClick={() => setSelectedTab('challenges')}
                  className={`px-4 py-2 ${selectedTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Challenges
                </button>
              </div>

              {/* Conditional rendering based on selected tab */}
              {selectedTab === 'reports' &&  (
                <>
                  <ReportDataVisualization jsonData={jsonData} scoreData={scoreData} />
                  <UserReports userId={userId} />
                </>
              )}

              {selectedTab === 'challenges' && (
                <>
                  <ChallengesDataVisualization submissionData={submissionData} submissionTypes={submissionTypes} />
                  <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: headingFont }}>Challenges Submissions</h1>
                  <SubmissionTable userId={userId} />
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <p   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>Loading...</p>
      )}
    </div>
  );
}

export default UserDetails;
