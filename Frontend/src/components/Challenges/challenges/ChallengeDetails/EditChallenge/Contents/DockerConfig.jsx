import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../../Partials/ConfirmationModal';
import AssignDockerImageModal from './AssignDockerImage';

const DockerManager = ({ challengeId }) => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState({ name: '', port: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

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

  const handleDeleteImage = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/images/deassign/${challengeId}`, {
        method: 'PATCH',
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

  const handleEditImage = (image) => {
    console.log(image);
    setCurrentImage(image);
    setIsEditMode(true);
    setIsModalOpen(true);
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
            <div>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded">
                Assign Docker Image
              </button>
            </div>
          )}
        </div>
        {isModalOpen && (
          <AssignDockerImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            challengeId={challengeId}
            apiUrl={apiUrl}
            onImageAssign={fetchImages}
            isEditMode={isEditMode}
            currentImage={currentImage}
          />
        )}
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
