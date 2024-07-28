import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const DynamicFlags = ({ challengeId }) => {
  const [flags, setFlags] = useState([]);
  const [error, setError] = useState('');

  // Function to fetch dynamic flags and users
  const fetchDynamicFlags = async (challengeId) => {
    try {
      const response = await fetch(`http://localhost:80/api/dynamicFlags/display/${challengeId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch dynamic flags');
      }

      const data = await response.json();
      setFlags(data.flags);
    } catch (error) {
      console.error('Error fetching dynamic flags:', error);
      setError('Failed to fetch dynamic flags');
    }
  };

  useEffect(() => {
    if (challengeId) {
      fetchDynamicFlags(challengeId);
    }
  }, [challengeId]);

  return (
    <div className="max-w-4xl mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flag
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flags.map((flagObj, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <pre className="text-gray-700">{flagObj.flag}</pre>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                <span>{flagObj.assignedUser}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <FontAwesomeIcon icon={faEdit} className="text-blue-500 cursor-pointer me-4" onClick={() => handleEditFlag(index)} />
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleDeleteFlag(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicFlags;
