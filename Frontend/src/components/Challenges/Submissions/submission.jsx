import React, { useEffect, useState } from 'react';
import PageHeader from '../navbar/PageHeader';
import { FaTrash } from 'react-icons/fa';

const SubmissionTable = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:80/api/submissions/all');
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

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

  const handleDeleteSelected = async () => {
    try {
      await fetch('http://localhost:80/api/submissions/delete', {
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

  return (
    <>
      <PageHeader pageTitle="Submissions" />
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
          {selectedSubmissions.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete Selected
            </button>
          )}
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Challenge Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Is Correct
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submission.userId?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.challengeId?.name || 'Unknown Challenge'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.answer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.isCorrect ? (
                      <span className="text-green-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.date).toLocaleTimeString()}
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
