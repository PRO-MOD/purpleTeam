import React, { useState } from 'react';

function FetchEncryptedFlag() {
  const [teamname, setTeamname] = useState('');
  const [ctfdflag, setCtfdflag] = useState('');
  const [encryptedFlag, setEncryptedFlag] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://13.127.232.191:5000/api/auth/fetch-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth-token': localStorage.getItem('Hactify-Auth-token')
        },
        body: JSON.stringify({ ctfdFlag: ctfdflag }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch encrypted flag');
      }

      const data = await response.json();
      setEncryptedFlag(data.encryptedFlag);
      setError('');
    } catch (error) {
      setError('Error fetching encrypted flag');
      console.error('Error fetching encrypted flag:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md p-8 bg-gradient-to-r from-orange-400 via-yellow-500 to-yellow-600 rounded-md shadow-lg">
        <h1 className="text-3xl font-semibold text-white mb-8">Fetch Encrypted Flag</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ctfdflag" className="block text-lg font-semibold text-white">CTFd Flag:</label>
            <input
              type="text"
              id="ctfdflag"
              value={ctfdflag}
              onChange={(e) => setCtfdflag(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 bg-opacity-50 py-2 px-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              placeholder="Enter CTFd flag"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-yellow-600 hover:text-yellow-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Fetch Encrypted Flag
          </button>
        </form>
        {encryptedFlag && <div className="mt-8 text-xl font-semibold text-white">Encrypted Flag: {encryptedFlag}</div>}
        {error && <div className="mt-8 text-xl font-semibold text-red-500">Error: {error}</div>}
      </div>
    </div>
  );
}

export default FetchEncryptedFlag;
