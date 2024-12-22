import React, { useEffect, useState, useContext } from 'react';
import Loading from './Loading';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faList, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../context/FontContext';

function ScoreTable({ scores, loading, isHomePage }) {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const navigate = useNavigate();
  const [sortedScores, setSortedScores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'descending' });
  // const [mode, setMode] = useState(''); // State to store the mode
  const mode="ctfd";
  // Fetch the mode from the API
  // useEffect(() => {
  //   const fetchMode = async () => {
  //     try {
  //       const response = await fetch(`${apiUrl}/api/config/mode`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setMode(data.mode);
  //       } else {
  //         console.error('Failed to fetch mode');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching mode:', error);
  //     }
  //   };

  //   fetchMode();
  // }, [apiUrl]);

  // Sort scores when scores, loading state, or sortConfig changes
  useEffect(() => {
    if (!loading && scores.length > 0) {
      const sorted = scores.slice().sort((a, b) => {
        let totalScoreA = a.score;
        let totalScoreB = b.score;

        if (mode === 'purpleTeam') {
          totalScoreA += (a.manualScore || 0) + (a.staticScore || 0);
          totalScoreB += (b.manualScore || 0) + (b.staticScore || 0);
        }

        if (sortConfig.key === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'totalScore') {
          return sortConfig.direction === 'ascending' ? totalScoreA - totalScoreB : totalScoreB - totalScoreA;
        } else {
          const keyA = a[sortConfig.key] || 0;
          const keyB = b[sortConfig.key] || 0;
          return sortConfig.direction === 'ascending' ? keyA - keyB : keyB - keyA;
        }
      });

      setSortedScores(sorted);
    }
  }, [scores, loading, sortConfig, mode]);

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

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
    }
    return faSort;
  };

  return (
    <div className="flex flex-col">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex flex-row justify-center cursor-pointer"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
            >
              Rank 
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
            >
              Name <FontAwesomeIcon icon={getSortIcon('name')} />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('score')}
             style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
              Score <FontAwesomeIcon icon={getSortIcon('score')} />
            </th>
            {mode === 'purpleTeam' && (
              <>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('manualScore')}
                 style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                  Incident Response <FontAwesomeIcon icon={getSortIcon('manualScore')} />
                </th>
                </>
            )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('staticScore')}
                 style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                  Static Score <FontAwesomeIcon icon={getSortIcon('staticScore')} />
                </th>
            
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('totalScore')}style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
            >
              Total Score <FontAwesomeIcon icon={getSortIcon('totalScore')} />
            </th>
            {mode === 'purpleTeam' && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                Checked
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={mode === 'purpleTeam' ? 7 : 4}>
                <Loading />
              </td>
            </tr>
          ) : (
            sortedScores.length > 0 ? (
              sortedScores.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className='flex flex-row justify-center items-center'  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{index + 1}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isHomePage ? '' : 'text-indigo-600 hover:text-indigo-900 cursor-pointer'}`}
                    onClick={() => {
                      if (isHomePage) {
                        return;
                      }
                      handleUserClick(user.name);
                    }}
                  >
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{user.score}</td>
                  {mode === 'purpleTeam' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{user.manualScore == null ? 'Not entered' : user.manualScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.staticScore == null ? 'Not entered' : user.staticScore}</td>
                    </>
                  )}
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.staticScore == null ? 'Not entered' : user.staticScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mode === 'purpleTeam' ? user.score + (user.manualScore || 0) + (user.staticScore || 0) : user.score+user.staticScore || 0 }
                  </td>
                  {mode === 'purpleTeam' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
                      {user.read ? <FontAwesomeIcon icon={faCheckDouble} className='text-green-500'  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }} /> : <FontAwesomeIcon icon={faList} className='text-red-500'  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }} />}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={mode === 'purpleTeam' ? 7 : 4} className='px-6 py-4 text-center'  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>No Record Found</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;
