// src/components/DockerManager.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../../Partials/ConfirmationModal'; // Import the new component

const DockerManager = ({ challengeId }) => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState({ name: '', port: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // State for confirmation modal
  const [imageToDelete, setImageToDelete] = useState(null); // State to hold the image ID for deletion
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/images/${challengeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images.');
      }

      setImages(data);
    } catch (error) {
      console.error('Error fetching Docker images:', error);
      setMessage('Error fetching images.');
    }
  };

  const handleSaveImage = async () => {
    if (!currentImage.name.trim()) {
      setMessage('Please provide an image name.');
      return;
    }

    setIsLoading(true);
    try {
      const url = isEditMode
        ? `${apiUrl}/api/docker/edit/images/${currentImage._id}`
        : `${apiUrl}/api/docker/images/pull`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageName: currentImage.name.trim(),
          challengeId,
          port: currentImage.port
        }),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update image.' : 'Failed to pull image.');
      }

      setMessage(isEditMode ? 'Image updated successfully' : 'Image pulled successfully');
      fetchImages(); // Refresh the image list
      setIsModalOpen(false); // Close modal
    } catch (error) {
      setMessage(isEditMode ? 'Error updating image.' : 'Error pulling image.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/images/${imageToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image.');
      }

      setMessage('Image deleted successfully.');
      setConfirmDelete(false); // Close confirmation modal
      fetchImages(); // Refresh the image list
    } catch (error) {
      setMessage('Error deleting image.');
      console.error('Error deleting Docker image:', error);
    }
  };

  const handleCreateContainer = async (challengeId) => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/create/container`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create container.');
      }

      setMessage(`Container created: ${data.url}`);
    } catch (error) {
      setMessage('Error creating container.');
      console.error('Error creating container:', error);
    }
  };

  const handleStopContainer = async (containerId) => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/stop/container`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ containerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to stop container.');
      }

      setMessage('Container stopped successfully.');
    } catch (error) {
      setMessage('Error stopping container.');
      console.error('Error stopping container:', error);
    }
  };

  const handleStartAdd = () => {
    setCurrentImage({ name: '', port: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditImage = (image) => {
    setCurrentImage(image);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  const openDeleteConfirmation = (imageId) => {
    setImageToDelete(imageId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteImage();
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setImageToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 mx-12">
        <div className="flex flex-row items-center mb-2">
          <h3 className="font-medium text-xl">Docker Images</h3>
          {images.length < 1 && (
            <FontAwesomeIcon
              icon={faPlus}
              className="text-blue-500 cursor-pointer mx-2"
              onClick={handleStartAdd}
              title="Pull Docker Image"
            />
          )}
        </div>
        {images.length === 0 ? (
          <p>No images available.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.length > 0 && images.map((image) => (
                <tr key={image._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{image.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{image.port || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-green-500 cursor-pointer me-4"
                      onClick={() => handleEditImage(image)}
                      title="Edit Image"
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red-500 cursor-pointer"
                      onClick={() => openDeleteConfirmation(image._id)}
                      title="Delete Image"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {message && <p className="mt-4">{message}</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Image' : 'Add Image'}</h2>
            <input
              type="text"
              value={currentImage.name}
              onChange={(e) => setCurrentImage({ ...currentImage, name: e.target.value })}
              placeholder="Image Name"
              disabled={isEditMode}
              className="mb-4 border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              value={currentImage.port}
              onChange={(e) => setCurrentImage({ ...currentImage, port: e.target.value })}
              placeholder="Port"
              className="mb-4 border border-gray-300 p-2 rounded w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveImage}
                className="bg-blue-500 text-white p-2 rounded-sm mr-2 flex flex-row items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Loading...
                    <img src="/loading.gif" alt="Loading..." className="w-[20px] h-[20px] ml-2" />
                  </>
                ) : (
                  isEditMode ? 'Save Changes' : 'Add Image'
                )}
              </button>

              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white p-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmationModal
          message={`Are you sure you want to delete the image "${images.length > 0 && images.map((image) => (image.name)).join(",")}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DockerManager;
