import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import InputField from '../Challenges/challenges/Partials/InputFeild';
import PageHeader from '../Challenges/navbar/PageHeader';
import FontContext from '../../context/FontContext';

const CreateRepo = () => {
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const apiUrl = import.meta.env.VITE_Backend_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${apiUrl}/api/repositories/create`; // Your backend API endpoint for creating a repository

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Repository created:', data);

      // Show success message
      setSuccessMessage('Repository created successfully! Redirecting...');

      // Reset form data
      setFormData({
        name: '',
        description: '',
      });

      // Redirect to /repository after 2 seconds
      setTimeout(() => {
        navigate('/repository');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating repository:', error);
    }
  };

  const formFields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter repository name',
      description: 'The name of your repository',
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      placeholder: 'Enter repository description',
      description: 'A brief description of your repository',
    },
  ];

  return (
    <div>
      <PageHeader pageTitle="Create Repository"  style={{ fontFamily: headingFont }}
       />
      <div className="col-md-7 ms-8 me-24 py-4" id="create-repo-entry-div"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
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
            <button
              className="btn btn-primary float-right bg-blue-500 text-white py-2 px-4 rounded"
              type="submit"
              style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
              Create Repository
            </button>
          </div>
        </form>

        {successMessage && (
          <div className="mt-4 text-green-600" style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRepo;
