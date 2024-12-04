import React, { useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ChallengeModal from './Partials/ChallengeModal';
import InputField from './Partials/InputFeild'; // Import the new InputField component

const CreateChallengeForm = ({ selectedOption }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    value: '',
    type: selectedOption,
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, type: selectedOption }));
  }, [selectedOption]);

  const [showModal, setShowModal] = useState(false);
  const [challengeId, setChallengeId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const apiUrl = import.meta.env.VITE_Backend_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${apiUrl}/api/challenges/create`; // Replace with your actual backend endpoint

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Challenge created:', data);

      setShowModal(true);
      setChallengeId(data.challengeId);

      setFormData({
        name: '',
        category: '',
        description: '',
        value: '',
        type: selectedOption,
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formFields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter challenge name',
      description: 'The name of your challenge',
    },
    {
      label: 'Category',
      name: 'category',
      type: 'text',
      placeholder: 'Enter challenge category',
      description: 'The category of your challenge',
    },
    {
      label: 'Value',
      name: 'value',
      type: 'number',
      placeholder: 'Enter value',
      description:
        'This is how many points are rewarded for solving this challenge.',
    },
  ];

  return (
    <div className="col-md-7 ms-8 me-24">
      <div id="create-chal-entry-div">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              description={field.description}
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}

          <div className="form-group">
            <label className="block text-gray-700">
              Message:
              <br />
              <small className="form-text text-gray-500">
                Use this to give a brief introduction to your challenge.
              </small>
            </label>
            <SimpleMDE
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>

          <input type="hidden" name="state" value="hidden" />

          <div className="form-group">
            <button
              className="btn btn-primary float-right bg-blue-500 text-white py-2 px-4 rounded"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <ChallengeModal
          challengeId={challengeId}
          selectedOption={selectedOption}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default CreateChallengeForm;
