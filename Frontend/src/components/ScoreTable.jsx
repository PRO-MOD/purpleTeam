import React, { useState } from 'react';
import Loading from './Loading';

function ScoreTable({ scores, loading }) {
  const [manualScore, setManualScore] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleManualScoreChange = (e) => {
    setManualScore(e.target.value);
  };

  const handleAddManualScore = (user) => {
    console.log('Adding manual score for user:', user);
    console.log('Manual score:', manualScore);
    setManualScore('');
  };

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleKeyDown = (e) => {
    // Prevent default behavior for arrow keys
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CTFD Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manual Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Score
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <Loading />
          ) : (
            scores.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.manualScore || 'Not entered'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.score + (user.manualScore || 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900">Add Manual Score</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add Manual Score</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Enter manual score for {selectedUser.name}:</p>
                      <input
                        type="text" // Change the input type to text
                        pattern="[0-9]*" 
                        className="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-lg border-gray-300 rounded-md p-3" // Increase the padding and change the text size
                        value={manualScore}
                        onChange={handleManualScoreChange}
                        placeholder='Enter Numbers only'
                        onKeyDown={handleKeyDown}
                        onKeyPress={(e) => {
                          // Allow only numbers and the backspace key
                          const isValidChar = /[0-9\b]/.test(e.key);
                          if (!isValidChar) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={() => { handleAddManualScore(selectedUser); closeModal(); }} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Add
                </button>
                <button onClick={closeModal} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreTable;
