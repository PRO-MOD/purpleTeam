import React, { useState } from 'react';
import PageHeader from '../Challenges/navbar/PageHeader';

const Configuration = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState(null);

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (logo) formData.append('logo', logo);

    try {
      const response = await fetch(`${apiUrl}/api/challenges/updateLogo`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Logo and title updated successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating logo and title:', error);
    }
  };

  return (
    <>
      <PageHeader pageTitle="Configuration" />
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-2">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-lg font-semibold mb-2">Upload Logo</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default Configuration;
