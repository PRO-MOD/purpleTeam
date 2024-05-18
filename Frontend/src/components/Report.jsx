
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Report() {
//   const apiUrl = import.meta.env.VITE_Backend_URL;
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     ID:'',
//     description: '',
//     threatLevel: '',
//     areasOfConcern: '',
//     sources: '',
//     indicatorsOfCompromise: '',
//     recentVulnerabilities: '',
//     patchStatus: '',
//     Status:'',
//     currentOperations: '',
//     pocScreenshots: [],
//     pdfName: '',
//     reportType: 'SITREP',
//     userId: '', 
//    // Make sure to provide a valid user ID here
//   });

//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(''); // Error state

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'pocScreenshot') {


//       // If input is for photos, check if the number of photos exceeds 5
//       if (formData.pocScreenshots.length >= 5) {
//         alert("You can't add more than 5 photos");
//         return;
//       }
//       setFormData((prevData) => ({
//         ...prevData,
//         pocScreenshots: [...prevData.pocScreenshots, ...files],
//       }));
//     } else {
//       // Otherwise, update form data normally
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   // let ReportType;
//   // (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : (window.location.href.includes("incident")) ? ReportType = "INCIDENT" : ReportType = "DAY_END"

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     setLoading(true); // Set loading state to true
//   //     setError(''); // Clear previous errors
//   //     const response = await fetch(`${apiUrl}/api/reports/SITREP`, {
//   //       method: 'POST',
//   //       body: JSON.stringify(formData),
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Auth-token': localStorage.getItem('Hactify-Auth-token')
//   //       },
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
//   //     }

//   //     console.log('Form submitted successfully');
//   //     alert('Response submitted successfully!');
//   //     navigate('/');
//   //   } catch (error) {
//   //     console.error('Error submitting form:', error);
//   //     setError('Failed to submit form. Please try again.'); // Set error message
//   //   } finally {
//   //     setLoading(false); // Set loading state to false regardless of success or failure
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true); // Set loading state to true
//       setError(''); // Clear previous errors

//       const formDataToSend = new FormData(); // Create a FormData object

//       // Append all form data fields to the FormData object
//       Object.entries(formData).forEach(([key, value]) => {
//         // If the value is an array (e.g., pocScreenshots), append each item separately
//         if (Array.isArray(value)) {
//           value.forEach((item) => {
//             formDataToSend.append(key, item);
//           });
//         } else {
//           formDataToSend.append(key, value);
//         }
//       });

//       // // Now, append the images to the FormData object
//       // formData.pocScreenshots.forEach((file) => {
//       //   formDataToSend.append('pocScreenshots', file);
//       // });

//       const response = await fetch(`${apiUrl}/api/reports/SITREP`, {
//         method: 'POST',
//         body: formDataToSend, // Use FormData object instead of JSON.stringify(formData)
//         headers: {
//           // Remove 'Content-Type' header since it's automatically set by FormData
//           'Auth-token': localStorage.getItem('Hactify-Auth-token')
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
//     <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl mb-8 text-center font-bold text-brown-650">SITREP Report Form</h2>
//       {error && <div className="text-red-500 mb-4">Error: {error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">

//       <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Incident ID:<span className="text-red-500 ml-1">*</span></label>
//             <select className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="ID" value={formData.ID} onChange={handleInputChange} required>
//               <option value="">Select Threat Level</option>
//               <option value="Low">Low</option>
//               <option value="Guarded">Guarded</option>
//               <option value="Elevated">Elevated</option>
//               <option value="High">High</option>
//               <option value="Severe">Severe</option>
//             </select>
//           </div>
//         {/* 1. Current Situation */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">1. Current Situation</h3>
//           {/* Description */}
//           <div>
//             <label className="block mb-1 text-gray-700">Description:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the current situation' />
//           </div>

//           {/* Threat Level */}
//           <div>
//             <label className="block mb-1 text-gray-700">Threat Level:<span className="text-red-500 ml-1">*</span></label>
//             <select className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="threatLevel" value={formData.threatLevel} onChange={handleInputChange} required>
//               <option value="">Select Threat Level</option>
//               <option value="Low">Low</option>
//               <option value="Guarded">Guarded</option>
//               <option value="Elevated">Elevated</option>
//               <option value="High">High</option>
//               <option value="Severe">Severe</option>
//             </select>
//           </div>

//           {/* Areas of Concern */}
//           <div>
//             <label className="block mb-1 text-gray-700">Areas of Concern:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="areasOfConcern" value={formData.areasOfConcern} onChange={handleInputChange} placeholder='List of current security concerns or vulnerabilities' />
//           </div>
//         </div>



//         {/* 3. Threat Intelligence */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">2. Threat Intelligence</h3>
//           {/* Sources */}
//           <div>
//             <label className="block mb-1 text-gray-700">Sources:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="sources" value={formData.sources} onChange={handleInputChange} placeholder='List of sources for threat intelligence' />
//           </div>

//           {/* Key Threat Actors */}

//           {/* Indicators of Compromise */}
//           <div>
//             <label className="block mb-1 text-gray-700">Indicators of Compromise:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of relevant IOCs' />
//           </div>
//         </div>

//         {/* 4. Vulnerability Management */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">3. Vulnerability Management</h3>
//           {/* Recent Vulnerabilities */}
//           <div>
//             <label className="block mb-1 text-gray-700">Recent Vulnerabilities:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="recentVulnerabilities" value={formData.recentVulnerabilities} onChange={handleInputChange} required placeholder='Summary of recently discovered vulnerabilities' />
//           </div>

//           {/* Patch Status */}
//           <div>
//             <label className="block mb-1 text-gray-700">Patch Status:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="patchStatus" value={formData.patchStatus} onChange={handleInputChange} required placeholder='Overview of patching efforts and status' />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Status:<span className="text-red-500 ml-1">*</span></label>
//             <select className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="Status" value={formData.Status} onChange={handleInputChange} required>
//               <option value="">Select Status</option>
//               <option value="Ongoing">Ongoing</option>
//               <option value="Not Identified">Not Identified</option>
//             </select>
//           </div>

//           {/* Mitigation Recommendations */}
//           {/* <div>
//             <label className="block mb-1 text-gray-700">Mitigation Recommendations:</label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required placeholder='Recommendations for mitigating known vulnerabilities' />
//           </div> */}
//         </div>

//         {/* 5. Security Operations */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">4. Security Operations</h3>
//           {/* Current Operations */}
//           <div>
//             <label className="block mb-1 text-gray-700">Current Operations:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="currentOperations" value={formData.currentOperations} onChange={handleInputChange} required placeholder='Overview of ongoing security operations or activities' />
//           </div>

//           {/* Incident Response */}
//           {/* <div>
//             <label className="block mb-1 text-gray-700">Incident Response:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="incidentResponse" value={formData.incidentResponse} onChange={handleInputChange} required placeholder='Summary of recent incident response activities' />
//           </div> */}

//           {/* Forensic Analysis */}
//           {/* <div>
//             <label className="block mb-1 text-gray-700">Forensic Analysis:<span className="text-red-500 ml-1">*</span></label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="forensicAnalysis" value={formData.forensicAnalysis} onChange={handleInputChange} required placeholder='Status of ongoing forensic analysis efforts' />
//           </div> */}
//         </div>

//         {/* 6. Communication */}


//         {/* 7. Future Planning */}


//         {/* 8. Additional Notes (Optional) */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">7. Additional Notes</h3>
//           <div>
//             <label className="block mb-1 text-gray-700">Additional Notes (optional)</label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
//           </div>
//         </div>

//         {/* 9. Submission */}
//         {/* <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">9. Submission</h3>
//           <div>
//             <label className="block mb-1 text-gray-700">Prepared By</label>
//             <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="prepared" value={formData.prepared} onChange={handleInputChange} placeholder='Name of the individual(s) preparing the report' />
//           </div>
//         </div> */}

//         {/* 10. POC (Screenshots) */}
//         <div>
//           <h3 className="text-xl mb-2 font-semibold text-gray-800">8. POC (Screenshots)</h3>
//           <div>
//             <label className="block mb-1 text-gray-700">Screenshots (up to 5):</label>
//             <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" type="file" name="pocScreenshot" multiple onChange={handleInputChange} />
//           </div>
//         </div>

//         <button type="submit" className="w-full bg-brown-650  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
//       </form>
//     </div>
//   );
// }


// export default Report;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function Report() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ID: '',
    description: '',
    threatLevel: '',
    areasOfConcern: '',
    sources: '',
    indicatorsOfCompromise: '',
    recentVulnerabilities: '',
    patchStatus: '',
    Status: '',
    currentOperations: '',
    pocScreenshots: [],
    pdfName: '',
    reportType: 'IRREP',
    userId: '',
    // Make sure to provide a valid user ID here
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [incidentData, setIncidentData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pocScreenshot') {
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

  const handleSelectChange = async (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption.value,
    }));

    if (name === 'ID' && selectedOption) {
      const transformedId = selectedOption.value.replace('IR', 'IN');
      await fetchIncidentData(transformedId);
    } else {
      setIncidentData(null);
    }
  };

  const fetchIncidentData = async (incidentId) => {
    try {
      setLoading(true);
      setError('');
      setIncidentData(null);
      const response = await fetch(`${apiUrl}/api/reports/notification/${incidentId}`, {
        method: 'GET',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Notification Report data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setIncidentData(data);
    } catch (error) {
      console.error('Error fetching incident data:', error);
      setError('Failed to fetch Notification Report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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

      const response = await fetch(`${apiUrl}/api/reports/IRREP`, {
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
  const incidentIdOptions = [
    { value: 'IR-01-001', label: 'IR-01-001' },
    { value: 'IR-01-002', label: 'IR-01-002' },
    { value: 'IR-01-003', label: 'IR-01-003' },
    { value: 'IR-01-004', label: 'IR-01-004' },
    { value: 'IR-01-005', label: 'IR-01-005' },
    { value: 'IR-01-006', label: 'IR-01-006' },
    { value: 'IR-01-007', label: 'IR-01-007' },
    { value: 'IR-01-008', label: 'IR-01-008' },
    { value: 'IR-01-009', label: 'IR-01-009' },
    { value: 'IR-01-010', label: 'IR-01-010' },
    { value: 'IR-01-011', label: 'IR-01-011' },
    { value: 'IR-02-001', label: 'IR-02-001' },
    { value: 'IR-02-002', label: 'IR-02-002' },
    { value: 'IR-02-003', label: 'IR-02-003' },
    { value: 'IR-02-004', label: 'IR-02-004' },
    { value: 'IR-02-005', label: 'IR-02-005' },
    { value: 'IR-02-006', label: 'IR-02-006' },
    { value: 'IR-02-007', label: 'IR-02-007' },
    { value: 'IR-02-008', label: 'IR-02-008' },
    { value: 'IR-02-009', label: 'IR-02-009' },
    { value: 'IR-03-001', label: 'IR-03-001' },
    { value: 'IR-03-002', label: 'IR-03-002' },
    { value: 'IR-03-003', label: 'IR-03-003' },
    { value: 'IR-03-004', label: 'IR-03-004' },
    { value: 'IR-03-005', label: 'IR-03-005' },
    { value: 'IR-03-006', label: 'IR-03-006' },
    { value: 'IR-03-007', label: 'IR-03-007' },
    { value: 'IR-03-008', label: 'IR-03-008' },
    { value: 'IR-03-009', label: 'IR-03-009' },
    { value: 'IR-03-010', label: 'IR-03-010' },
  ];

  const threatLevelOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Guarded', label: 'Guarded' },
    { value: 'Elevated', label: 'Elevated' },
    { value: 'High', label: 'High' },
    { value: 'Severe', label: 'Severe' },
  ];

  const statusOptions = [
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Not Identified', label: 'Not Identified' },
  ];

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl mb-8 text-center font-bold text-brown-650">IRREP Form</h2>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Incident ID */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Incident ID:<span className="text-red-500 ml-1">*</span></label>
          <Select
            name="ID"
            options={incidentIdOptions}
            value={incidentIdOptions.find(option => option.value === formData.ID)}
            onChange={handleSelectChange}
            isClearable
            required
          />
        </div>

        {incidentData && (
          <div className="mb-4">
            <h3 className="text-xl mb-2 font-semibold text-gray-800">Incident Details:</h3>
            <p>Description: {incidentData.description}</p>
            <p>Location: {incidentData.location}</p>
          </div>
        )}

        {/* 1. Current Situation */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">1. Current Situation</h3>
          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700">Description:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the current situation' />
          </div>

          {/* Threat Level */}
          <div>
            <label className="block mb-1 text-gray-700">Threat Level:<span className="text-red-500 ml-1">*</span></label>
            <Select
              name="threatLevel"
              options={threatLevelOptions}
              value={threatLevelOptions.find(option => option.value === formData.threatLevel)}
              onChange={handleSelectChange}
              isClearable
              required
            />
          </div>

          {/* Areas of Concern */}
          <div>
            <label className="block mb-1 text-gray-700">Areas of Concern:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="areasOfConcern" value={formData.areasOfConcern} onChange={handleInputChange} placeholder='List of current security concerns or vulnerabilities' />
          </div>
        </div>

        {/* 2. Threat Intelligence */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">2. Threat Intelligence</h3>
          {/* Sources */}
          <div>
            <label className="block mb-1 text-gray-700">Sources:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="sources" value={formData.sources} onChange={handleInputChange} placeholder='List of sources for threat intelligence' />
          </div>

          {/* Indicators of Compromise */}
          <div>
            <label className="block mb-1 text-gray-700">Indicators of Compromise:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of relevant IOCs' />
          </div>
        </div>

        {/* 3. Vulnerability Management */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">3. Vulnerability Management</h3>
          {/* Recent Vulnerabilities */}
          <div>
            <label className="block mb-1 text-gray-700">Recent Vulnerabilities:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="recentVulnerabilities" value={formData.recentVulnerabilities} onChange={handleInputChange} required placeholder='Summary of recently discovered vulnerabilities' />
          </div>

          {/* Patch Status */}
          <div>
            <label className="block mb-1 text-gray-700">Patch Status:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="patchStatus" value={formData.patchStatus} onChange={handleInputChange} required placeholder='Overview of patching efforts and status' />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Status:<span className="text-red-500 ml-1">*</span></label>
            <Select
              name="Status"
              options={statusOptions}
              value={statusOptions.find(option => option.value === formData.Status)}
              onChange={handleSelectChange}
              isClearable
              required
            />
          </div>
        </div>

        {/* 4. Security Operations */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">4. Security Operations</h3>
          {/* Current Operations */}
          <div>
            <label className="block mb-1 text-gray-700">Current Operations:<span className="text-red-500 ml-1">*</span></label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="currentOperations" value={formData.currentOperations} onChange={handleInputChange} required placeholder='Overview of ongoing security operations or activities' />
          </div>
        </div>

        {/* 7. Additional Notes (Optional) */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">7. Additional Notes</h3>
          <div>
            <label className="block mb-1 text-gray-700">Additional Notes (optional)</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
          </div>
        </div>

        {/* 8. POC (Screenshots) */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">8. POC (Screenshots)</h3>
          <div>
            <label className="block mb-1 text-gray-700">Screenshots (up to 5):</label>
            <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" type="file" name="pocScreenshot" multiple onChange={handleInputChange} />
          </div>
        </div>

        <button type="submit" className="w-full bg-brown-650  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
}

export default Report;
