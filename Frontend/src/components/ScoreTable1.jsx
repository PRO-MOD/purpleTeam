import React, { useEffect, useState, useContext } from 'react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import FontContext from '../context/FontContext';
import ColorContext from '../context/ColorContext';

function ScoreTable({ scores, loading, isHomePage }) {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const navigate = useNavigate();
  const [uniqueDates, setUniqueDates] = useState([]);
  const [sortedScores, setSortedScores] = useState([]);
  const { bgColor, textColor, sidenavColor, hoverColor,tableColor } = useContext(ColorContext);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);


  // Extract unique dates from scores and sort them
  useEffect(() => {
    if (!loading && Object.keys(scores).length > 0) {
      const dates = Object.values(scores).reduce((acc, userScores) => {
        userScores.forEach(score => {
          if (!acc.includes(score.date)) {
            acc.push(score.date);
          }
        });
        return acc;
      }, []);
      const sortedDates = dates.sort();
      setUniqueDates(sortedDates);
      setSortedScores(groupScoresByDate(scores, sortedDates));
      // console.log(sortedScores);
    }
  }, [scores, loading]);

  // Function to group scores by date
  const groupScoresByDate = (scores, dates) => {
    // console.log(scores);
    const groupedScores = {};
    Object.keys(scores).forEach(userName => {
      const userScores = scores[userName];
      groupedScores[userName] = { name: userName, scores: {}, manualScores: {} };
      userScores.forEach(score => {
        groupedScores[userName].scores[score.date] = score.score;
        groupedScores[userName].manualScores[score.date] = score.manualScore;
      });
    });
    return groupedScores;
  };

  const getUserTotalScore = (userData) => {
    let totalScore = 0;
    for (const date in userData.scores) {
      totalScore += userData.scores[date];
    }
    for (const date in userData.manualScores) {
      totalScore += userData.manualScores[date];
    }
    return totalScore;
  };

  const handleUserClick = async userName => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/user?name=${userName}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data._id) {
          navigate(`/user/${data._id}`); // Navigate to the user's report page
        } else {
          console.log('User not found');
        }
      } else {
        console.error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
    }
  };

  return (
    <div className="flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="" style={{backgroundColor:tableColor}}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex flex-row justify-center"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                Name
              </th>
              {uniqueDates.map((date, index) => (
                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"style={{ fontFamily: navbarFont }}>
                  {`Day ${index + 1}`}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.values(sortedScores).map((score, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="flex flex-row justify-center items-center"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{index + 1}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isHomePage ? '' : 'text-indigo-600 hover:text-indigo-900 cursor-pointer'}`}
                  onClick={() => {
                    if (isHomePage) {
                      return;
                    }
                    handleUserClick(score.name);
                  }}
                   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
                  {score.name}
                </td>
                {uniqueDates.map((date, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
                    {score.scores[date] ? `${score.scores[date]} / ${score.manualScores[date]}` : '-'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getUserTotalScore(score)}
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScoreTable;
