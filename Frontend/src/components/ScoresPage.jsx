import React, { useState, useEffect } from 'react';
import ScoreTable from './ScoreTable';
import { useLocation } from 'react-router-dom';

function ScoresComponent() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const location = useLocation();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/score/getscores');
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
    
    fetchScores();
  }, []);

  const isHomePage = () => {
    return location.pathname === '/';
  };

  return (
    <div className='mx-16 my-12'>
      <h1 className='text-3xl font-bold'>{`Scores ${isHomePage() ? "Board" : ""}`}</h1>
      <hr className='mt-4 mb-8'/>
      {error && <p>Error: {error}</p>}
      <ScoreTable scores={scores} loading={loading} isHomePage={isHomePage()}/>
    </div>
  );
}

export default ScoresComponent;
