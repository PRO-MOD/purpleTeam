

import React, { useEffect, useState } from 'react';
import PageHeader from '../navbar/PageHeader';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ConfirmationModal from '../challenges/Partials/ConfirmationModal';

const SubmissionTable = ({ challengeId, userId }) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [deletionAction, setDeletionAction] = useState(null); // State to track the deletion action

  const location = useLocation();  // Use location hook to get current path

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let url = `${apiUrl}/api/submissions/all`;

        if (challengeId) {
          url = `${apiUrl}/api/submissions/submissions/${challengeId}`;
        } else if (userId) {
          url = `${apiUrl}/api/submissions/userSubmissions/${userId}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [challengeId, userId]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectSubmission = (submissionId) => {
    setSelectedSubmissions((prevSelected) =>
      prevSelected.includes(submissionId)
        ? prevSelected.filter((id) => id !== submissionId)
        : [...prevSelected, submissionId]
    );
  };

  const handleDeleteSelected = ()=> {
    setDeletionAction(()=>async()=>{
    try {
      await fetch(`${apiUrl}/api/submissions/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionIds: selectedSubmissions }),
      });

      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => !selectedSubmissions.includes(submission._id))
      );
      setSelectedSubmissions([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error deleting submissions:', error);
    }
  })
  setShowModal(true);
  };


  const handleConfirmDelete = async () => {
    if (deletionAction) {
      await deletionAction();
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };
  

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === 'correct' && !submission.isCorrect) return false;
    if (filter === 'incorrect' && submission.isCorrect) return false;
    if (
      searchTerm &&
      !(
        submission.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.challengeId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubmissions([]);
    } else {
      const allIds = filteredSubmissions.map((submission) => submission._id);
      setSelectedSubmissions(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Check if the current route contains "progress"
  const isInProgress = location.pathname.includes("progress");

  return (
    <>
      {/* <PageHeader pageTitle="Submissions" /> */}
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div>
              <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="ml-2 p-2 border border-gray-300 rounded"
              >
                <option value="all">All Submissions</option>
                <option value="correct">Correct Submissions</option>
                <option value="incorrect">Incorrect Submissions</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search by user or challenge name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          {!isInProgress && selectedSubmissions.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete Selected
            </button>
          )}

          
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete the selected challenges? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
               <th className="px-6 py-3 border-b border-gray-600 text-left text-xs font-medium text-black uppercase tracking-wider">
               {!isInProgress&& (<input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                )}
                </th>
               
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Challenge Name
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Is Correct
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 border-b border-gray-400 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Attempt 
                </th>
              </tr>
            </thead>
            {/* <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.includes(submission._id)}
                      onChange={() => handleSelectSubmission(submission._id)}
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls
                  font-medium text-gray-900">
                    {submission.userId?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {submission.challengeId?.name || 'Unknown Challenge'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {submission.answer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {submission.isCorrect ? (
                      <span className="text-green-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {submission.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {new Date(submission.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ls text-gray-500">
                    {new Date(submission.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody> */}

<tbody className="bg-white divide-y divide-gray-200">
  {filteredSubmissions.map((submission) => (
    <tr
      key={submission._id}
      className={`hover:bg-gray-100 transition duration-150 ease-in-out`}
    >
      {/* Conditionally render the checkbox if not in the "progress" route */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-900'
      }`}>
        {!isInProgress && (
          <input
            type="checkbox"
            checked={selectedSubmissions.includes(submission._id)}
            onChange={() => handleSelectSubmission(submission._id)}
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          />
        )}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls font-medium ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-900'
      }`}>
        {submission.userId?.name || 'Unknown User'}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {submission.challengeId?.name || 'Unknown Challenge'}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {submission.answer}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {submission.isCorrect ? (
          <span className="text-green-500 font-semibold">Yes</span>
        ) : (
          <span className="text-red-500 font-semibold">No</span>
        )}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {submission.points}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {new Date(submission.date).toLocaleDateString()}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {new Date(submission.date).toLocaleTimeString()}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-ls ${
        !isInProgress && submission.cheating ? 'text-red-500' : 'text-gray-500'
      }`}>
        {submission.attempt}
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>
      </div>
    </>
  );
};

export default SubmissionTable;
