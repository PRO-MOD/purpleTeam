
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../Challenges/navbar/PageHeader';
import ConfirmationModal from '../Challenges/challenges/Partials/ConfirmationModal';
import AddModal from './AddModal';
import RepoAllChallenges from './RepoAllChallenges';

const RepoDetailsPage = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { id } = useParams(); // Get repository ID from URL params
  const [repo, setRepo] = useState(null); // Initially set to null
  const [showModal, setShowModal] = useState(false); // State for showing the delete modal
  const [showAddModal, setShowAddModal] = useState(false); // State for showing the add modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/repositories/${id}`);
        const data = await response.json();
        setRepo(data); // Set fetched data
      } catch (error) {
        console.error('Error fetching repository details:', error);
      }
    };

    fetchRepo();
  }, [id, apiUrl]);

  const handleDelete = async () => {
    try {
      await fetch(`${apiUrl}/api/repositories/${id}`, { method: 'DELETE' });
      navigate('/repository'); // Redirect to repositories page after deletion
    } catch (error) {
      console.error('Error deleting repository:', error);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true); // Open add modal
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false); // Close add modal
  };

  const handleOpenDeleteModal = () => {
    setShowModal(true); // Open delete modal
  };

  const handleCloseDeleteModal = () => {
    setShowModal(false); // Close delete modal
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseDeleteModal();
  };

  // Conditional rendering: check if repo is available
  return (
    <div className="w-full">
      {repo ? ( // Render only if repo is not null
        <>
          <PageHeader
            challengeDetails={{ name: repo.name }} // Use repository name
            onAdd={handleOpenAddModal} // Show add button
            onDelete={handleOpenDeleteModal} // Show delete button
          />

          {showModal && (
            <ConfirmationModal
              message="Are you sure you want to delete this repository? This action cannot be undone."
              onConfirm={handleConfirmDelete} // Handle delete confirmation
              onCancel={handleCloseDeleteModal} // Close modal on cancel
            />
          )}

          {showAddModal && (
            <AddModal 
              onClose={handleCloseAddModal} 
              repositoryId={id} // Pass repositoryId to AddModal
            />
          )}
        </>
      ) : (
        <p>Loading repository details...</p> // Display loading message while fetching data
      )}
      <RepoAllChallenges repositoryId={id}  />
    </div>
  );
};

export default RepoDetailsPage;
