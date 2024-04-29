// // Report.jsx

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Report() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     question1: '',
//     question2: '',
//     question3: '',
//     question4: '',
//     question5: '',
//     photos: [], // Array to store photo files
//   });

//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(''); // Error state

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'photo') {
//       // If input is for photos, check if the number of photos exceeds 5
//       if (formData.photos.length >= 5) {
//         alert("You can't add more than 5 photos");
//         return;
//       }
//       setFormData((prevData) => ({
//         ...prevData,
//         photos: [...prevData.photos, ...files],
//       }));
//     } else {
//       // Otherwise, update form data normally
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true); // Set loading state to true
//       setError(''); // Clear previous errors
//       const formDataToSend = new FormData();
//       formDataToSend.append('question1', formData.question1);
//       formDataToSend.append('question2', formData.question2);
//       formDataToSend.append('question3', formData.question3);
//       formDataToSend.append('question4', formData.question4);
//       formDataToSend.append('question5', formData.question5);
//       // Append each photo file to FormData
//       formData.photos.forEach((photo) => {
//         formDataToSend.append('photos', photo);
//       });

//       let ReportType;
//       (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : (window.location.href.includes("incident")) ? ReportType = "INCIDENT" : ReportType = "DAY_END"

//       const response = await fetch(`http://localhost:5000/api/reports/${ReportType}`, {
//         method: 'POST',
//         body: formDataToSend,
//         headers: {
//           "Auth-token": localStorage.getItem('Hactify-Auth-token')
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
//       }

//       console.log('Form submitted successfully');
//       alert('Response submitted successfully!');
//       navigate('/');
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setError('Failed to submit form. Please try again.'); // Set error message
//     } finally {
//       setLoading(false); // Set loading state to false regardless of success or failure
//     }
//   };


//   return (
//     <div className="container mx-auto p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             htmlFor="question1"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Question 1
//           </label>
//           <textarea
//             id="question1"
//             name="question1"
//             rows="3"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//             placeholder="Type your answer here..."
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="question2" className="block text-gray-700 text-sm font-bold mb-2">
//             Question 2
//           </label>
//           <textarea
//             id="question2"
//             name="question2"
//             rows="3"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//             placeholder="Type your answer here..."
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="question3" className="block text-gray-700 text-sm font-bold mb-2">
//             Question 3
//           </label>
//           <textarea
//             id="question3"
//             name="question3"
//             rows="3"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//             placeholder="Type your answer here..."
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="question4" className="block text-gray-700 text-sm font-bold mb-2">
//             Question 4
//           </label>
//           <textarea
//             id="question4"
//             name="question4"
//             rows="3"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//             placeholder="Type your answer here..."
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="question5" className="block text-gray-700 text-sm font-bold mb-2">
//             Question 5
//           </label>
//           <textarea
//             id="question5"
//             name="question5"
//             rows="3"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//             placeholder="Type your answer here..."
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="photo"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Upload Photos
//           </label>
//           <input
//             type="file"
//             id="photo"
//             name="photo"
//             multiple // Allow multiple files to be selected
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={handleInputChange}
//           />
//         </div>
//         {/* Error message */}
//         {error && <div className="text-red-500 mb-4">{error}</div>}
        
//         {/* Submit button with loading state */}
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Submitting...' : 'Submit'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Report;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    threatLevel: '',
    areasOfConcern: [],
    recentIncidents: '',
    trendAnalysis: '',
    impactAssessment: '',
    sources: [],
    keyThreatActors: '',
    indicatorsOfCompromise: [],
    recentVulnerabilities: '',
    patchStatus: '',
    mitigationRecommendations: '',
    currentOperations: '',
    incidentResponse: '',
    forensicAnalysis: '',
    internalNotifications: [],
    externalNotifications: [],
    publicRelations: '',
    riskAssessment: '',
    continuityPlanning: '',
    trainingAndExercises: '',
    pocScreenshots: [],
    pdfName: '',
    reportType: '',
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
  let ReportType;
      (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : (window.location.href.includes("incident")) ? ReportType = "INCIDENT" : ReportType = "DAY_END"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true
      setError(''); // Clear previous errors
      const response = await fetch(`http://localhost:5000/api/reports/${ReportType}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
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
    <div>
      <h2>Report Form</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Description */}
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
  
        {/* Threat Level */}
        <div>
          <label>Threat Level:</label>
          <select name="threatLevel" value={formData.threatLevel} onChange={handleInputChange} required>
            <option value="">Select Threat Level</option>
            <option value="Low">Low</option>
            <option value="Guarded">Guarded</option>
            <option value="Elevated">Elevated</option>
            <option value="High">High</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
  
        {/* Areas of Concern */}
        <div>
          <label>Areas of Concern:</label>
          <textarea name="areasOfConcern" value={formData.areasOfConcern} onChange={handleInputChange} />
        </div>
  
        {/* Recent Incidents */}
        <div>
          <label>Recent Incidents:</label>
          <textarea name="recentIncidents" value={formData.recentIncidents} onChange={handleInputChange} required />
        </div>
  
        {/* Trend Analysis */}
        <div>
          <label>Trend Analysis:</label>
          <textarea name="trendAnalysis" value={formData.trendAnalysis} onChange={handleInputChange} required />
        </div>
  
        {/* Impact Assessment */}
        <div>
          <label>Impact Assessment:</label>
          <textarea name="impactAssessment" value={formData.impactAssessment} onChange={handleInputChange} required />
        </div>
  
        {/* Sources */}
        <div>
          <label>Sources:</label>
          <textarea name="sources" value={formData.sources} onChange={handleInputChange} />
        </div>
  
        {/* Key Threat Actors */}
        <div>
          <label>Key Threat Actors:</label>
          <textarea name="keyThreatActors" value={formData.keyThreatActors} onChange={handleInputChange} required />
        </div>
  
        {/* Indicators of Compromise */}
        <div>
          <label>Indicators of Compromise:</label>
          <textarea name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} />
        </div>
  
        {/* Recent Vulnerabilities */}
        <div>
          <label>Recent Vulnerabilities:</label>
          <textarea name="recentVulnerabilities" value={formData.recentVulnerabilities} onChange={handleInputChange} required />
        </div>
  
        {/* Patch Status */}
        <div>
          <label>Patch Status:</label>
          <textarea name="patchStatus" value={formData.patchStatus} onChange={handleInputChange} required />
        </div>
  
        {/* Mitigation Recommendations */}
        <div>
          <label>Mitigation Recommendations:</label>
          <textarea name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required />
        </div>
  
        {/* Current Operations */}
        <div>
          <label>Current Operations:</label>
          <textarea name="currentOperations" value={formData.currentOperations} onChange={handleInputChange} required />
        </div>
  
        {/* Incident Response */}
        <div>
          <label>Incident Response:</label>
          <textarea name="incidentResponse" value={formData.incidentResponse} onChange={handleInputChange} required />
        </div>
  
        {/* Forensic Analysis */}
        <div>
          <label>Forensic Analysis:</label>
          <textarea name="forensicAnalysis" value={formData.forensicAnalysis} onChange={handleInputChange} required />
        </div>
  
        {/* Internal Notifications */}
        <div>
          <label>Internal Notifications:</label>
          <textarea name="internalNotifications" value={formData.internalNotifications} onChange={handleInputChange} />
        </div>
  
        {/* External Notifications */}
        <div>
          <label>External Notifications:</label>
          <textarea name="externalNotifications" value={formData.externalNotifications} onChange={handleInputChange} />
        </div>
  
        {/* Public Relations */}
        <div>
          <label>Public Relations:</label>
          <textarea name="publicRelations" value={formData.publicRelations} onChange={handleInputChange} required />
        </div>
  
        {/* Risk Assessment */}
        <div>
          <label>Risk Assessment:</label>
          <textarea name="riskAssessment" value={formData.riskAssessment} onChange={handleInputChange} required />
        </div>
  
        {/* Continuity Planning */}
        <div>
          <label>Continuity Planning:</label>
          <textarea name="continuityPlanning" value={formData.continuityPlanning} onChange={handleInputChange} required />
        </div>
  
        {/* Training and Exercises */}
        <div>
          <label>Training and Exercises:</label>
          <textarea name="trainingAndExercises" value={formData.trainingAndExercises} onChange={handleInputChange} required />
        </div>
  
        {/* POC Screenshots */}
        <div>
          <label>POC Screenshots (up to 5):</label>
          <input type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
        </div>
  
        <button type="submit" disabled={loading}>Submit</button>
      </form>
    </div>
  );
  
}

export default Report;
