import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { useNavigate } from "react-router-dom";

function ScoreTable({ scores, loading, isHomePage }) {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const navigate = useNavigate();
  const [sortedScores, setSortedScores] = useState([]);

  // Sort scores when scores or loading state changes
  useEffect(() => {
    if (!loading && scores.length > 0) {
      const sorted = scores.slice().sort((a, b) => b.score - a.score); // Sort scores in descending order
      setSortedScores(sorted);
    }
  }, [scores, loading]);

  const handleUserClick = async (userName) => {
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex flex-row justify-center">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service Availability
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Incident Response
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          ) : (
            sortedScores.length > 0 ? (
              sortedScores.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className='flex flex-row justify-center items-center'>{index+1}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isHomePage ? '' : 'text-indigo-600 hover:text-indigo-900 cursor-pointer'
                      }`}
                    onClick={() => {
                      if (isHomePage) {
                        return;
                      }
                      handleUserClick(user.name);
                    }}
                  >{user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.manualScore == null ? 'Not entered' : user.manualScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.score + (user.manualScore || 0)}</td>
                </tr>
              ))) : <tr><td colSpan="4" className='px-6 py-4 text-center'>No Record Found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;