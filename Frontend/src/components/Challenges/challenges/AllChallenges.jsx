import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const AllChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:80/api/challenges/toDisplayAllChallenges');
        const data = await response.json();
        setChallenges(data);

        const uniqueCategories = [...new Set(data.map(challenge => challenge.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleSelectChallenge = (challengeId) => {
    setSelectedChallenges(prevSelected =>
      prevSelected.includes(challengeId)
        ? prevSelected.filter(id => id !== challengeId)
        : [...prevSelected, challengeId]
    );
  };

  const handleDeleteChallenges = async () => {
    try {
      const response = await fetch('http://localhost:80/api/challenges/deleteChallenges', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedChallenges }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        setChallenges(prevChallenges => prevChallenges.filter(challenge => !selectedChallenges.includes(challenge._id)));
        setSelectedChallenges([]);
      } else {
        console.error('Error deleting challenges:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting challenges:', error);
    }
  };

  const sortedChallenges = [...challenges].sort((a, b) => {
    const aValue = a[searchField];
    const bValue = b[searchField];

    // Handle sorting by category (alphabetically)
    if (searchField === 'category') {
      return aValue.localeCompare(bValue);
    }

    // Handle sorting by numeric fields (value)
    if (searchField === 'value') {
      return aValue - bValue;
    }

    // Default to sorting by string fields (name, type, state)
    return aValue.localeCompare(bValue);
  });

  const filteredChallenges = sortedChallenges.filter(challenge => {
    if (searchQuery === '') return true;
    return String(challenge[searchField]).toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  function handleDetailsClick(challengeId, event) {
    if (!event.target.closest('input[type="checkbox"]')) {
      navigate(`/challenges/${challengeId}`);
    }
  }
  return (
    <div className="container mx-auto p-4 my-8 w-full">
      <div className="mb-4 mx-auto">
        <form className="flex flex-wrap justify-center gap-4">
          <div className="">
            <select
              id="field"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-sm outline-0 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="category">Category</option>
              <option value="type">Type</option>
              <option value="state">State</option>
            </select>
          </div>
          <div className="w-3/4">
            <input
              id="q"
              name="q"
              placeholder="Search for matching challenge"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-sm outline-0 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>
        </form>
      </div>
      <hr className="mx-8 my-4 " />

      <div className='mb-8 flex flex-row justify-end h-[20px]'>
        {selectedChallenges.length > 0 && (
          <FontAwesomeIcon icon={faTrashCan} className='bg-red-400 text-white p-2 rounded-sm me-8' onClick={handleDeleteChallenges} />
        )}
      </div>

      <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-[90%] mx-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Value</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">State</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {filteredChallenges.map((challenge, index) => (
            <tr
              className="odd:bg-white even:bg-gray-50 dark:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 cursor-pointer"
              key={challenge._id}
              onClick={(event) => handleDetailsClick(challenge._id, event)} // Redirect on row click
            >
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{challenge.name}</td>
              <td className="py-2 px-4 border-b">{challenge.value}</td>
              <td className="py-2 px-4 border-b">{challenge.category}</td>
              <td className="py-2 px-4 border-b">{challenge.type}</td>
              <td className="py-2 px-4 border-b"><span className={`px-2 text-center rounded-sm text-white font-semibold ${challenge.state == "hidden" ? "bg-red-500" : "bg-green-500"}`}>{challenge.state.charAt(0).toUpperCase() + challenge.state.slice(1)}</span></td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedChallenges.includes(challenge._id)}
                  onChange={() => handleSelectChallenge(challenge._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllChallenges;
