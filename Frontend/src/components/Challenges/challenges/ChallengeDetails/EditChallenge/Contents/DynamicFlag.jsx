import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';
import ColorContext from '../../../../../../context/ColorContext';

const DynamicFlags = ({ challengeId }) => {
  const [flags, setFlags] = useState([]);
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFlag, setEditFlag] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_Backend_URL;

  // Fetch font settings from context
  const { navbarFont, headingFont, paraFont } = useContext(FontContext);
  const { tableColor } = useContext(ColorContext);

  // Function to fetch dynamic flags and users
  const fetchDynamicFlags = async (challengeId) => {
    try {
      const response = await fetch(`${apiUrl}/api/dynamicFlags/display/${challengeId}`);
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

  const handleEditFlag = (index) => {
    setEditingIndex(index);
    setEditFlag(flags[index].flag);
    setModalOpen(true);
  };

  const saveEditFlag = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/dynamicFlags/edit/${challengeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index: editingIndex, flag: editFlag }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit flag');
      }

      const updatedFlags = [...flags];
      updatedFlags[editingIndex].flag = editFlag;
      setFlags(updatedFlags);
      setEditingIndex(null);
      setEditFlag('');
      setModalOpen(false);
    } catch (error) {
      console.error('Error editing flag:', error);
      setError('Failed to edit flag');
    }
  };

  const handleDeleteFlag = async (index) => {
    try {
      const response = await fetch(`${apiUrl}/api/dynamicFlags/delete/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete flag');
      }

      setFlags(flags.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting flag:', error);
      setError('Failed to delete flag');
    }
  };

  const closeModal = () => {
    setEditingIndex(null);
    setEditFlag('');
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && <p style={{ ...paraFont, color: 'red' }}>{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr style={{backgroundColor: tableColor}}>
            <th scope="col" className="px-6 py-3 text-left" style={navbarFont}>
              Flag
            </th>
            <th scope="col" className="px-6 py-3 text-left" style={navbarFont}>
              Assigned User
            </th>
            <th scope="col" className="px-6 py-3 text-left" style={navbarFont}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flags.map((flagObj, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <pre style={paraFont}>{flagObj.flag}</pre>
              </td>
              <td className="px-6 py-4 whitespace-nowrap" style={paraFont}>
                <span>{flagObj.assignedUser}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-blue-500 cursor-pointer me-4"
                  onClick={() => handleEditFlag(index)}
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteFlag(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing flag */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 style={headingFont} className="mb-4">Edit Flag</h2>
            <div className="mb-4">
              <input
                type="text"
                value={editFlag}
                onChange={(e) => setEditFlag(e.target.value)}
                placeholder="Enter flag"
                className="border border-gray-300 p-2 rounded-sm w-full mb-2"
                style={paraFont}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white p-2 rounded-sm mr-2"
                style={navbarFont}
              >
                Cancel
              </button>
              <button
                onClick={saveEditFlag}
                className="bg-green-600 text-white p-2 rounded-sm"
                style={navbarFont}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFlags;
