import React, { useState, useEffect } from 'react';
import ScoreTable from './ScoreTable1';
import { useLocation } from 'react-router-dom';

function ScoresComponent() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const location = useLocation();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/score/get-scores`);
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
    UpdateScores();
    UpdateManualScores();
    fetchScores();
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
        <h1 className='text-3xl font-bold underline'>{`Scores ${isHomePage() ? "Board" : ""}`}</h1>
        <span className='ms-4'>Format ( CTFD Score / Manual Score )</span>
      </div>
      <hr className='mt-4 mb-8' />
      {error && <p>Error: {error}</p>}
      <ScoreTable scores={scores} loading={loading} isHomePage={isHomePage()} />
    </div>
  );
}

export default ScoresComponent;
