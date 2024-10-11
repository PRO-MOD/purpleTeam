// src/repositories/RepoAllChallenges.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import InfoTable from '../Challenges/challenges/Partials/InfoTable';
import ConfirmationModal from '../Challenges/challenges/Partials/ConfirmationModal';

const RepoAllChallenges = ({ repositoryId }) => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletionAction, setDeletionAction] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/repositories/${repositoryId}/challenges`);
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [repositoryId, apiUrl]);

  const handleSelectChallenge = (challengeId) => {
    setSelectedChallenges(prevSelected =>
      prevSelected.includes(challengeId)
        ? prevSelected.filter(id => id !== challengeId)
        : [...prevSelected, challengeId]
    );
  };

  const handleSelectAllChallenges = (selectAll) => {
    if (selectAll) {
      // Select all challenges
      setSelectedChallenges(challenges.map(challenge => challenge._id));
    } else {
      // Deselect all challenges
      setSelectedChallenges([]);
    }
  };

  const handleDeleteChallenges = () => {
    setDeletionAction(() => async () => {
      try {
        const response = await fetch(`${apiUrl}/api/repositories/${repositoryId}/challenges`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ challengeIds: selectedChallenges }), // Send challenge IDs in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to delete challenges');
        }

        // Update local state to reflect deletion
        setChallenges(prevChallenges => prevChallenges.filter(challenge => !selectedChallenges.includes(challenge._id)));
        setSelectedChallenges([]);
      } catch (error) {
        console.error('Error deleting challenges:', error);
      }
    });
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

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Value', accessor: 'value' },
    { header: 'Category', accessor: 'category' },
    { header: 'Type', accessor: 'type' },
    { header: 'State', accessor: 'state' },
  ];

  return (
    <div className="container mx-auto p-4 my-8 w-full">
      <div className="mb-4 mx-auto">
        {challenges.length <= 0 && (
          <div className="mb-8 flex flex-row justify-center items-center text-gray-700">
            <span onClick={() => navigate('/admin/challenge/create')} className="cursor-pointer">
              Add Challenges to Repository
              <FontAwesomeIcon icon={faPlusCircle} className="mx-2" />
            </span>
          </div>
        )}
      </div>

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete the selected challenges? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <InfoTable
        data={challenges}
        columns={columns}
        onRowClick={(challengeId, event) => {
          if (!event.target.closest('input[type="checkbox"]')) {
            navigate(`/challenges/${challengeId}`);
          }
        }}
        selectedItems={selectedChallenges}
        onItemSelect={handleSelectChallenge}
        onSelectAll={handleSelectAllChallenges} // Pass the onSelectAll function
        onDelete={handleDeleteChallenges}
      />
    </div>
  );
};

export default RepoAllChallenges;
