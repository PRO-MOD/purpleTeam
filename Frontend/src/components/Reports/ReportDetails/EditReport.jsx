import React, { useState } from 'react';
import InputField from '../../Challenges/challenges/Partials/InputFeild';

const EditReport = ({ report }) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [fields, setFields] = useState({
    name: report.name,
    description: report.description,
    deadline: report.deadline ? report.deadline.split('T')[0] : '', // Extract date from ISO string
    index: report.index || 0, // Default to 0 if not provided
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/api/reports/edit/${report._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      const data = await response.json();
      console.log('Report updated:', data);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating report:', error);
      setError('Failed to update report');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 10000);
    }
  };

  const inputFields = [
    { label: 'Report Name', description: 'Enter the name of the report', type: 'text', id: 'name', name: 'name', placeholder: 'Enter report name' },
    { label: 'Description', description: 'Provide a brief description of the report', type: 'text', id: 'description', name: 'description', placeholder: 'Enter report description' },
    { label: 'Deadline', description: 'Set the deadline for the report', type: 'date', id: 'deadline', name: 'deadline', placeholder: '' },
    { label: 'Index', description: 'Enter the index for the report', type: 'number', id: 'index', name: 'index', placeholder: 'Enter report index' },
  ];

  return (
    <div className="container mx-auto p-6">
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Report updated successfully!</p>}

        {inputFields.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            description={field.description}
            type={field.type}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={fields[field.name]}
            onChange={handleChange}
          />
        ))}

        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReport;
