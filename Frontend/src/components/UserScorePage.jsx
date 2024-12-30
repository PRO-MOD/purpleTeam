import React, { useState, useEffect, useContext } from 'react';
import ScoreTable from './ScoreTable';
// import UserScoreTable from './UserScoreTable';
import UserScoreTable from './UserScoreTable';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faDownload, faList } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../context/FontContext';

function UserscoresComponent() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const location = useLocation();
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/score/get-user-scores`);
        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }
        const data = await response.json();
        setScores(data);
        setLoading(false); // Set loading to false after fetching scores
      } catch (error) {
        setError(error.message);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    // UpdateScores();
    // UpdateManualScores();
    fetchScores();

    // Fetching scores periodically every 5 minutes
    const interval = setInterval(fetchScores, 60000); // 300000 milliseconds = 5 minutes

    // Clear interval on component unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, []);


  const UpdateScores = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/score/getscores`);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data = await response.json();
    } catch (error) {
      setError(error.message);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const UpdateManualScores = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/score/sum-manual-scores`);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data = await response.json();
      setLoading(false); // Set loading to false after fetching scores
    } catch (error) {
      setError(error.message);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const isHomePage = () => {
    return location.pathname === '/';
  };

  return (
    <div className='mx-16 my-12 '>
      <div className="flex flex-row items-center">
        <h1 className='text-3xl font-bold underline' style={{fontFamily:headingFont}}>{`Scores ${isHomePage() ? "Board" : ""}`}</h1>
        {/* <span className='ms-4'>Format ( Challenge Score / Manual Score )</span> */}
      </div>
      <hr className='mt-4 mb-8' />
      {error && <p>Error: {error}</p>}
      <UserScoreTable scores={scores} loading={loading} isHomePage={isHomePage()} />
    </div>
  );
}

export default UserscoresComponent;
