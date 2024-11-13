import React, { useState, useContext } from 'react';
import InputField from '../Challenges/challenges/Partials/InputFeild';
import FontContext from '../../context/FontContext';

const CreateReportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
  });
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_Backend_URL;
      const url = `${apiUrl}/api/reports/create`;

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
      console.log('Report created:', data);

      // Reset form data
      setFormData({
        name: '',
        description: '',
        deadline: '',
      });
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const formFields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter report name',
      description: 'The name of the report',
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      placeholder: 'Enter report description',
      description: 'A brief description of the report',
    },
    {
      label: 'Deadline',
      name: 'deadline',
      type: 'date',
      placeholder: '',
      description: 'The deadline for the report',
    },
  ];

  return (
    <div className="container mx-auto p-4 px-16">
      <h2 className="text-2xl font-bold mb-4" style={{fontFamily: headingFont}}>Create Report</h2>
      <form onSubmit={handleSubmit} className="space-y-6" style={{fontFamily:paraFont}}>
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
            className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded float-right"
            type="submit"
        style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}} >
            Create Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;
