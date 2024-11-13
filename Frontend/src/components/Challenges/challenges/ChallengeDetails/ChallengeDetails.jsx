

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../navbar/PageHeader';
import EditNavigation from './EditChallenge/EditNavigation';
import Content from './EditChallenge/Content';
import EditChallenge from './EditChallenge/EditChallenge';
import ConfirmationModal from '../Partials/ConfirmationModal'; // Import the modal component


const ChallengeDetailsPage = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { id } = useParams(); // Get challenge ID from URL params
  const [challenge, setChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('Files');
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const navigate = useNavigate();


  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/details/${id}`);
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error('Error fetching challenge details:', error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`${apiUrl}/api/challenges/delete/${id}`, { method: 'DELETE' });
      navigate('/challenges'); // Redirect to challenges page after deletion
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const handleSubmissions = () => {
    navigate(`/challenges/submissions/${id}`);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseModal();
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const tabs = ['Files', 'Flags', 'Topics', 'Tags', 'Hints', 'Requirements', 'Next', 'Users', 'Docker'];

  return (
    <div className="w-full">
      <PageHeader
        challengeDetails={{
          name: challenge.name,
          category: challenge.category,
          type: challenge.type,
          state: challenge.state,
          value: `${challenge.value} points`
        }}
        onDelete={handleOpenModal}    // Pass function to open modal
        onSubmissions={handleSubmissions}  // Pass submissions handler
      />
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this challenge? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}
      <div className="flex flex-row">
        <div className="w-1/2 flex flex-col">
          <EditNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          <div className="m-8">
            <Content activeTab={activeTab} challengeId={id} />
          </div>
        </div>
        <div className="w-1/2">
          <EditChallenge challenge={challenge} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;
