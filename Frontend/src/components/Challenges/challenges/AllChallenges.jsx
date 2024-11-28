
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEye, faEyeSlash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import InfoTable from '../challenges/Partials/InfoTable';
import ConfirmationModal from './Partials/ConfirmationModal';

const AllChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [actionMessage, setActionMessage] = useState(''); // Dynamic message for modal
  const [actionCallback, setActionCallback] = useState(null); // Callback for modal action
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/toDisplayAllChallenges`);
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleSelectChallenge = (challengeId) => {
    setSelectedChallenges((prevSelected) =>
      prevSelected.includes(challengeId)
        ? prevSelected.filter((id) => id !== challengeId)
        : [...prevSelected, challengeId]
    );
  };

  const handleDeleteChallenges = () => {
    setActionMessage('Are you sure you want to delete the selected challenges? This action cannot be undone.');
    setActionCallback(() => async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/deleteChallenges`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedChallenges }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);

          setChallenges((prevChallenges) =>
            prevChallenges.filter((challenge) => !selectedChallenges.includes(challenge._id))
          );
          setSelectedChallenges([]);
        } else {
          console.error('Error deleting challenges:', await response.json());
        }
      } catch (error) {
        console.error('Error deleting challenges:', error);
      }
    });
    setShowModal(true);
  };

  const handleUpdateState = (newState) => {
    setActionMessage(`Are you sure you want to set the selected challenges to "${newState}"?`);
    setActionCallback(() => async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/updateState`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedChallenges, state: newState }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);

          setChallenges((prevChallenges) =>
            prevChallenges.map((challenge) =>
              selectedChallenges.includes(challenge._id)
                ? { ...challenge, state: newState }
                : challenge
            )
          );
          setSelectedChallenges([]);
        } else {
          console.error('Error updating challenges state:', await response.json());
        }
      } catch (error) {
        console.error('Error updating challenges state:', error);
      }
    });
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (actionCallback) {
      await actionCallback();
    }
    setShowModal(false);
  };

  const handleCancelAction = () => {
    setShowModal(false);
  };

  const sortedChallenges = [...challenges].sort((a, b) => {
    const aValue = a[searchField];
    const bValue = b[searchField];

    if (searchField === 'category') {
      return aValue.localeCompare(bValue);
    }

    if (searchField === 'value') {
      return aValue - bValue;
    }

    return aValue.localeCompare(bValue);
  });

  const filteredChallenges = sortedChallenges.filter((challenge) => {
    if (searchQuery === '') return true;
    return String(challenge[searchField]).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDetailsClick = (challengeId, event) => {
    if (!event.target.closest('input[type="checkbox"]')) {
      navigate(`/challenges/${challengeId}`);
    }
  };

  const handleSelectAllChallenges = () => {
    if (selectedChallenges.length === challenges.length) {
      setSelectedChallenges([]);
    } else {
      setSelectedChallenges(challenges.map((challenge) => challenge._id));
    }
  };

  const handleAddChallenges = () => {
    navigate('/admin/challenge/create');
  };

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Initial Value', accessor: 'initial' },
    { header: 'Category', accessor: 'category' },
    { header: 'Type', accessor: 'type' },
    { header: 'State', accessor: 'state' },
  ];

  return (
    <div className="container mx-auto p-4 my-8 w-full">
      <div className="mb-4 mx-auto">
        <form className="flex flex-wrap justify-center gap-4">
          <div>
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

      {challenges.length <= 0 && (
        <div className="mb-8 flex flex-row justify-center items-center text-gray-700">
          <span onClick={handleAddChallenges} className="cursor-pointer">
            Add Challenges to View
            <FontAwesomeIcon icon={faPlusCircle} className="mx-2" />
          </span>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          message={actionMessage}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}

<div className="w-[90%] mx-auto">
<div className=' mr-16 flex flex-row justify-end h-[2px]'>
        {selectedChallenges.length > 0 && (
          <>
           
            <FontAwesomeIcon 
                            icon={faEye} 
                            className='bg-green-400 text-white p-2 rounded-sm me-8' 
                            onClick={() => handleUpdateState('visible')} 
                        />
            <FontAwesomeIcon 
                            icon={faEyeSlash} 
                            className='bg-gray-400 text-white p-2 rounded-sm me-8' 
                            onClick={() => handleUpdateState('hidden')} 
                        />

                        
          </>
        )}
      </div>
      </div>

      <InfoTable
        data={filteredChallenges}
        columns={columns}
        onRowClick={handleDetailsClick}
        selectedItems={selectedChallenges}
        onItemSelect={handleSelectChallenge}
        onSelectAll={handleSelectAllChallenges}
        onDelete={handleDeleteChallenges}
      />
    </div>
  );
};

export default AllChallenges;
