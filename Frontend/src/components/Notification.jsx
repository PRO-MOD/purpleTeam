
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    priority: '',
    action: '',
    mitre: '',
    step: '',
    notes: '',
    pocScreenshots: [],
    pdfName: '',
    reportType: 'Notification',
    userId: '', // Make sure to provide a valid user ID here
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pocScreenshots') {
      // If input is for photos, check if the number of photos exceeds 5
      if (formData.pocScreenshots.length >= 5) {
        alert("You can't add more than 5 photos");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        pocScreenshots: [...prevData.pocScreenshots, ...files],
      }));
    } else {
      // Otherwise, update form data normally
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // let ReportType;
  // (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : (window.location.href.includes("incident")) ? ReportType = "INCIDENT" : ReportType = "DAY_END"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true
      setError(''); // Clear previous errors
      
      const formDataToSend = new FormData(); // Create a FormData object
      
      // Append all form data fields to the FormData object
      Object.entries(formData).forEach(([key, value]) => {
        // If the value is an array (e.g., pocScreenshots), append each item separately
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formDataToSend.append(key, item);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });
   // Log the pocScreenshots separately
// console.log("pocScreenshots sent to backend:", formData.pocScreenshots);

      // Now, append the images to the FormData object
      // formData.pocScreenshots.forEach((file) => {
      //   formDataToSend.append('pocScreenshots', file);
      // });
  
      const response = await fetch(`http://localhost:5000/api/reports/Notification`, {
        method: 'POST',
        body: formDataToSend, // Use FormData object instead of JSON.stringify(formData)
        headers: {
          // Remove 'Content-Type' header since it's automatically set by FormData
          'Auth-token': localStorage.getItem('Hactify-Auth-token')
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
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
    <h2 className="text-3xl mb-4 text-center font-bold text-brown-650">Notification Report Form</h2>
    {error && <div className="text-red-500 mb-4">Error: {error}</div>}
    <form onSubmit={handleSubmit}>
      
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">1. Incident Type:</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="type" value={formData.type} onChange={handleInputChange} required  />
      </div>
  
  
      {/* Areas of Concern */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">2. Incident Location: </label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="location" value={formData.location} onChange={handleInputChange} required />
      </div>
  
      
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">3. Incident Priority:</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="priority" value={formData.priority} onChange={handleInputChange} required  />
      </div>
  
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">4. Action Taken:</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="action" value={formData.action} onChange={handleInputChange} required  />
      </div>
  
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">5. MITRE Technique:</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="mitre" value={formData.mitre} onChange={handleInputChange} required  />
      </div>
  
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">6. Remediation steps:</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="step" value={formData.step} onChange={handleInputChange} required  />
      </div>
  
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">7. Additional Information (if any) :</label>
        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="notes" value={formData.notes} onChange={handleInputChange}  />
      </div>
  
      {/* Attachment */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Attachment (up to 5):</label>
        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
      </div>
  
      {/* Submit Button */}
      <button type="submit" className="w-full bg-brown-650  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
    </form>
  </div>
  
  );
}

export default Notification;
