import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    photos: [], // Array to store photo files
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      // If input is for photos, check if the number of photos exceeds 5
      if (formData.photos.length >= 5) {
        alert("You can't add more than 5 photos");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        photos: [...prevData.photos, ...files],
      }));
    } else {
      // Otherwise, update form data normally
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true
      setError(''); // Clear previous errors
      const formDataToSend = new FormData();
      formDataToSend.append('question1', formData.question1);
      formDataToSend.append('question2', formData.question2);
      formDataToSend.append('question3', formData.question3);
      formDataToSend.append('question4', formData.question4);
      formDataToSend.append('question5', formData.question5);
      // Append each photo file to FormData
      formData.photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });
  
      let ReportType;
      (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : ReportType = "INCIDENT"
  
      const response = await fetch(`http://localhost:5000/api/reports/${ReportType}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          "Auth-token": localStorage.getItem('Hactify-Auth-token')
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
      }
  
      console.log('Form submitted successfully');
      alert('Response submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading state to false regardless of success or failure
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="question1"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Question 1
          </label>
          <textarea
            id="question1"
            name="question1"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="question2" className="block text-gray-700 text-sm font-bold mb-2">
            Question 2
          </label>
          <textarea
            id="question2"
            name="question2"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="question3" className="block text-gray-700 text-sm font-bold mb-2">
            Question 3
          </label>
          <textarea
            id="question3"
            name="question3"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="question4" className="block text-gray-700 text-sm font-bold mb-2">
            Question 4
          </label>
          <textarea
            id="question4"
            name="question4"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="question5" className="block text-gray-700 text-sm font-bold mb-2">
            Question 5
          </label>
          <textarea
            id="question5"
            name="question5"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Upload Photos
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            multiple // Allow multiple files to be selected
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
          />
        </div>
        {/* Error message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {/* Submit button with loading state */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Report;