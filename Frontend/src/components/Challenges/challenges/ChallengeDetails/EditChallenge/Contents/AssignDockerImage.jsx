import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';

const AssignDockerImageModal = ({ isOpen, onClose, challengeId, apiUrl, onImageAssign, isEditMode, currentImage }) => {
  const [images, setImages] = useState([]);
  const { navbarFont, headingFont, paraFont } = useContext(FontContext); // Using FontContext
  const [selectedImage, setSelectedImage] = useState(currentImage._id || '');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [newImageName, setNewImageName] = useState('');
  const [newImagePort, setNewImagePort] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/images`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch images.');
      setImages(data);
    } catch (error) {
      setMessage('Error fetching images.');
    }
  };

  const handleImageAssign = async () => {
    if (!selectedImage) {
      setMessage('Please select an image.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/docker/challenges/assignImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, imageId: selectedImage })
      });
      if (!response.ok) throw new Error('Failed to assign image.');
      setMessage('Image assigned successfully.');
      onImageAssign(); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      setMessage('Error assigning image.');
    }
  };

  const handlePullImage = async () => {
    if (!newImageName.trim()) {
      setMessage('Please provide an image name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/docker/images/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageName: newImageName, port: newImagePort })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'Failed to pull image.');
      }

      setMessage('Image pulled successfully.');
      fetchImages(); // Refresh images
      setIsAddingImage(false); // Close new image form
    } catch (error) {
      setMessage(error.message || 'Error pulling image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewImageToggle = () => {
    setIsAddingImage(!isAddingImage);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Heading */}
        <h2 
          className="text-2xl font-bold mb-4" 
          style={{
            fontFamily: headingFont.fontFamily,
            fontSize: headingFont.fontSize,
            fontWeight: headingFont.fontWeight
          }}
        >
          Assign Docker Image
        </h2>

        {/* Error or Success Message */}
        {message && (
          <p 
            className="text-red-500" 
            style={{ 
              fontFamily: paraFont.fontFamily, 
              fontSize: paraFont.fontSize 
            }}
          >
            {message}
          </p>
        )}

        {/* Image Dropdown */}
        <div className="mb-4">
          <label 
            className="block mb-2"
            style={{
              fontFamily: paraFont.fontFamily,
              fontSize: paraFont.fontSize
            }}
          >
            Select Image:
          </label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            style={{
              fontFamily: paraFont.fontFamily,
              fontSize: paraFont.fontSize
            }}
          >
            <option value="">-- Select Docker Image --</option>
            {images.map((image) => (
              <option key={image._id} value={image._id}>
                {image.name} (Port: {image.port || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        {/* Add New Image Toggle */}
        <div className="mb-4">
          <button
            className="text-blue-500 flex items-center mb-2"
            onClick={handleAddNewImageToggle}
            style={{
              fontFamily: paraFont.fontFamily,
              fontSize: paraFont.fontSize
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> {isAddingImage ? 'Cancel' : 'Add New Docker Image'}
          </button>
        </div>

        {/* Add New Image Fields */}
        {isAddingImage && (
          <div className="mb-4">
            <input
              type="text"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              placeholder="Image Name"
              className="w-full border border-gray-300 p-2 rounded mb-2"
              style={{
                fontFamily: paraFont.fontFamily,
                fontSize: paraFont.fontSize
              }}
            />
            <input
              type="text"
              value={newImagePort}
              onChange={(e) => setNewImagePort(e.target.value)}
              placeholder="Port"
              className="w-full border border-gray-300 p-2 rounded mb-4"
              style={{
                fontFamily: paraFont.fontFamily,
                fontSize: paraFont.fontSize
              }}
            />
            <button
              onClick={handlePullImage}
              className="bg-green-500 text-white p-2 rounded w-full"
              disabled={isLoading}
              style={{
                fontFamily: paraFont.fontFamily,
                fontSize: paraFont.fontSize
              }}
            >
              {isLoading ? 'Pulling Image...' : 'Pull Docker Image'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={handleImageAssign}
            className="bg-blue-500 text-white p-2 rounded mr-2"
            style={{
              fontFamily: navbarFont.fontFamily,
              fontSize: navbarFont.fontSize
            }}
          >
            Assign Image
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white p-2 rounded"
            style={{
              fontFamily: navbarFont.fontFamily,
              fontSize: navbarFont.fontSize
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AssignDockerImageModal;
