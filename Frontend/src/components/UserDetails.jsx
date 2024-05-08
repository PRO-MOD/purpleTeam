import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DataVisualization from './DataVisualization'
import TimeSeriesGraph from './TimeSeriesGraph'

import UserReports from './UserReports';

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://13.127.232.191:5000/api/auth/${userId}`);
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

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const [jsonData, setJsonData] = useState(null);

    useEffect(() => {
        // Fetch JSON data from API
        fetch(`http://13.127.232.191:5000/api/reports/specific/${userId}`)
            .then(response => response.json())
            .then(data => {
                setJsonData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {
        window.location.href.includes("/personal") ? 
        ""
        :
        <button onClick={handleGoBack} className="text-blue-500 hover:text-blue-700 underline flex flex-row justify-center items-center my-8"><FontAwesomeIcon icon={faArrowLeft} className='me-4' /> Back</button>
      }
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
            {/* {jsonData && <TimeSeriesGraph jsonData={jsonData} />} */}
          </div>
          {jsonData && 
          <div className='flex flex-row flex-wrap justify-center items-center'>
            <DataVisualization jsonData={jsonData} />
            <TimeSeriesGraph jsonData={jsonData} />
          </div>
          }
          <UserReports userId={userId} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserDetails;
