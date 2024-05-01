// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function IncidentReport() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     description: '',
//     severityLevel: '',
//     impact: '',
//     affectedSystems: [],
//     detectionMethod: '',
//     initialDetectionTime: '',
//     attackVector: '',
//     attackers: '',
//     containment: '',
//     eradication: '',
//     recovery: '',
//     lessonsLearned: '',
//     evidence: '',
//     indicatorsOfCompromise: [],
//     ttps: '',
//     mitigationRecommendations: '',
//     internalNotification: [],
//     externalNotification: [],
//     updates: '',
//     incidentReview: '',
//     documentation: false,
//     training: '',
//     pocScreenshots: [],
//     pdfName: '',
//     ReportType:'',
//     userId: '', 
//   });

//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(''); // Error state

//   // const handleInputChange = (e) => {
//   //   const { name, value, files } = e.target;
//   //   if (name === 'pocScreenshots') { // Adjusted condition to match file input name
//   //     // If input is for screenshots, check if the number of screenshots exceeds 5
//   //     if (formData.pocScreenshots.length >= 5) { // Adjusted property name to match state
//   //       alert("You can't add more than 5 screenshots");
//   //       return;
//   //     }
//   //     setFormData((prevData) => ({
//   //       ...prevData,
//   //       pocScreenshots: [...prevData.pocScreenshots, ...files], // Adjusted property name to match state
//   //     }));
//   //   }
//   //   else {
//   //     // Otherwise, update form data normally
//   //     setFormData((prevData) => ({
//   //       ...prevData,
//   //       [name]: value,
//   //     }));
//   //   }
//   // };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === 'checkbox') {
//       // For checkboxes, set the value to true if checked, false otherwise
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: checked,
//       }));
//     } else if (name === 'pocScreenshots') {
//       if (formData.pocScreenshots.length >= 5) {
//         alert("You can't add more than 5 screenshots");
//         return;
//       }
//       setFormData((prevData) => ({
//         ...prevData,
//         pocScreenshots: [...prevData.pocScreenshots, ...files],
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };
  
//   let ReportType;
//       (window.location.href.includes("SITREP")) ? ReportType = "SITREP" : (window.location.href.includes("incident")) ? ReportType = "INCIDENT" : ReportType = "DAY_END"

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true); // Set loading state to true
//       setError(''); // Clear previous errors
//       const response = await fetch(`http://localhost:5000/api/IncidentReport/${ReportType}`, {
//         method: 'POST',
//         body: JSON.stringify(formData),
//         headers: {
//           'Content-Type': 'application/json',
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
//     <div>
//       <h2>Report Form</h2>
//       {error && <div>Error: {error}</div>}
//       <form onSubmit={handleSubmit}>
//         {/* Description */}
//         <div>
//           <label>Description:</label>
//           <textarea name="description" value={formData.description} onChange={handleInputChange} required />
//         </div>
  
//         {/* Severity Level */}
//         <div>
//           <label>Severity Level:</label>
//           <select name="severityLevel" value={formData.severityLevel} onChange={handleInputChange} required>
//             <option value="">Select Severity Level</option>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//             <option value="Critical">Critical</option>
//           </select>
//         </div>
  
//         {/* Impact */}
//         <div>
//           <label>Impact:</label>
//           <select name="impact" value={formData.impact} onChange={handleInputChange} required>
//             <option value="">Select Impact</option>
//             <option value="Minimal">Minimal</option>
//             <option value="Moderate">Moderate</option>
//             <option value="Significant">Significant</option>
//             <option value="Severe">Severe</option>
//           </select>
//         </div>
  
//         {/* Affected Systems */}
//         <div>
//           <label>Affected Systems:</label>
//           <textarea name="affectedSystems" value={formData.affectedSystems} onChange={handleInputChange} />
//         </div>
  
//         {/* Detection Method */}
//         <div>
//           <label>Detection Method:</label>
//           <input type="text" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} required />
//         </div>
  
//         {/* Initial Detection Time */}
//         <div>
//           <label>Initial Detection Time:</label>
//           <input type="datetime-local" name="initialDetectionTime" value={formData.initialDetectionTime} onChange={handleInputChange} required />
//         </div>
  
//         {/* Attack Vector */}
//         <div>
//           <label>Attack Vector:</label>
//           <select name="attackVector" value={formData.attackVector} onChange={handleInputChange} required>
//             <option value="">Select Attack Vector</option>
//             <option value="Phishing">Phishing</option>
//             <option value="Malware">Malware</option>
//             <option value="Insider Threat">Insider Threat</option>
//             <option value="DoS">Denial of Service (DoS)</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>
  
//         {/* Attackers */}
//         <div>
//           <label>Attackers:</label>
//           <select name="attackers" value={formData.attackers} onChange={handleInputChange} required>
//             <option value="">Select Attackers</option>
//             <option value="External">External</option>
//             <option value="Internal">Internal</option>
//             <option value="Unknown">Unknown</option>
//           </select>
//         </div>
  
//         {/* Containment */}
//         <div>
//           <label>Containment:</label>
//           <textarea name="containment" value={formData.containment} onChange={handleInputChange} required />
//         </div>
  
//         {/* Eradication */}
//         <div>
//           <label>Eradication:</label>
//           <textarea name="eradication" value={formData.eradication} onChange={handleInputChange} required />
//         </div>
  
//         {/* Recovery */}
//         <div>
//           <label>Recovery:</label>
//           <textarea name="recovery" value={formData.recovery} onChange={handleInputChange} required />
//         </div>
  
//         {/* Lessons Learned */}
//         <div>
//           <label>Lessons Learned:</label>
//           <textarea name="lessonsLearned" value={formData.lessonsLearned} onChange={handleInputChange} required />
//         </div>
  
//         {/* Evidence */}
//         <div>
//           <label>Evidence:</label>
//           <textarea name="evidence" value={formData.evidence} onChange={handleInputChange} required />
//         </div>
  
//         {/* Indicators of Compromise */}
//         <div>
//           <label>Indicators of Compromise:</label>
//           <textarea name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} />
//         </div>
  
//         {/* Tactics, Techniques, and Procedures */}
//         <div>
//           <label>Tactics, Techniques, and Procedures (TTPs):</label>
//           <textarea name="ttps" value={formData.ttps} onChange={handleInputChange} required />
//         </div>
  
//         {/* Mitigation Recommendations */}
//         <div>
//           <label>Mitigation Recommendations:</label>
//           <textarea name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required />
//         </div>
  
//         {/* Internal Notification */}
//         <div>
//           <label>Internal Notification:</label>
//           <textarea name="internalNotification" value={formData.internalNotification} onChange={handleInputChange} />
//         </div>
  
//         {/* External Notification */}
//         <div>
//           <label>External Notification:</label>
//           <textarea name="externalNotification" value={formData.externalNotification} onChange={handleInputChange} />
//         </div>
  
//         {/* Updates */}
//         <div>
//           <label>Updates:</label>
//           <textarea name="updates" value={formData.updates} onChange={handleInputChange} required />
//         </div>
  
//         {/* Incident Review */}
//         <div>
//           <label>Incident Review:</label>
//           <input type="datetime-local" name="incidentReview" value={formData.incidentReview} onChange={handleInputChange} />
//         </div>
  
//         {/* Documentation */}
//         <div>
//           <label>Documentation:</label>
//           <input type="checkbox" name="documentation" checked={formData.documentation} onChange={handleInputChange} />
//         </div>
  
//         {/* Training */}
//         <div>
//           <label>Training:</label>
//           <textarea name="training" value={formData.training} onChange={handleInputChange} required />
//         </div>
  
//         {/* POC Screenshots */}
//         <div>
//           <label>POC Screenshots (up to 5):</label>
//           <input type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
//         </div>
  
//         <button type="submit" disabled={loading}>Submit</button>
//       </form>
//     </div>
//   );
  
// }

// export default IncidentReport;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function IncidentReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    severityLevel: '',
    impact: '',
    affectedSystems: '',
    detectionMethod: '',
    initialDetectionTime: '',
    attackVector: '',
    attackers: '',
    containment: '',
    eradication: '',
    recovery: '',
    lessonsLearned: '',
    evidence: '',
    indicatorsOfCompromise: '',
    ttps: '',
    mitigationRecommendations: '',
    internalNotification: '',
    externalNotification: '',
    updates: '',
    incidentReview: '',
    documentation: false,
    training: '',
    pocScreenshots: [],
    pdfName: '',
    ReportType:'',
    userId: '', 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === 'pocScreenshots') {
      if (formData.pocScreenshots.length >= 5) {
        alert("You can't add more than 5 screenshots");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        pocScreenshots: [...prevData.pocScreenshots, ...files],
      }));
    } else {
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
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:5000/api/IncidentReport/${ReportType}`, {
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
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
  <h2 className="text-3xl mb-4 text-center">Incident Report Form</h2>
  {error && <div className="text-red-500 mb-4">Error: {error}</div>}
  <form onSubmit={handleSubmit}>
    {/* 1. Incident Overview */}
    <h3 className="text-xl mb-2">1. Incident Overview</h3>
    {/* Description */}
    <div className="mb-4">
      <label className="block mb-1">Description:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the incident' />
    </div>

    {/* Severity Level */}
    <div className="mb-4">
      <label className="block mb-1">Severity Level:</label>
      <select className="w-full px-3 py-2 border rounded" name="severityLevel" value={formData.severityLevel} onChange={handleInputChange} required>
        <option value="">Select Severity Level</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
    </div>

    {/* Impact */}
    <div className="mb-4">
      <label className="block mb-1">Impact:</label>
      <select className="w-full px-3 py-2 border rounded" name="impact" value={formData.impact} onChange={handleInputChange} required>
        <option value="">Select Impact</option>
        <option value="Minimal">Minimal</option>
        <option value="Moderate">Moderate</option>
        <option value="Significant">Significant</option>
        <option value="Severe">Severe</option>
      </select>
    </div>

    {/* Affected Systems */}
    <div className="mb-4">
      <label className="block mb-1">Affected Systems:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="affectedSystems" value={formData.affectedSystems} onChange={handleInputChange} placeholder='List of systems or assets affected' />
    </div>

    {/* 2. Incident Details */}
    <h3 className="text-xl mb-2">2. Incident Details</h3>
    {/* Detection Method */}
    <div className="mb-4">
  <label className="block mb-1">Detection Method:</label>
  <select className="w-full px-3 py-2 border rounded" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} required>
    <option value="">Select Detection Method</option>
    <option value="Intrusion Detection System">Intrusion Detection System</option>
    <option value="Security Information and Event Management (SIEM)">Security Information and Event Management (SIEM)</option>
    <option value="Endpoint Detection and Response (EDR)">Endpoint Detection and Response (EDR)</option>
    <option value="User Report">User Report</option>
    <option value="Other">Other</option>
  </select>
</div>

    {/* Initial Detection Time */}
    <div className="mb-4">
      <label className="block mb-1">Initial Detection Time:</label>
      <input className="w-full px-3 py-2 border rounded" type="datetime-local" name="initialDetectionTime" value={formData.initialDetectionTime} onChange={handleInputChange} required />
    </div>

    {/* Attack Vector */}
    <div className="mb-4">
      <label className="block mb-1">Attack Vector:</label>
      <select className="w-full px-3 py-2 border rounded" name="attackVector" value={formData.attackVector} onChange={handleInputChange} required>
        <option value="">Select Attack Vector</option>
        <option value="Phishing">Phishing</option>
        <option value="Malware">Malware</option>
        <option value="Insider Threat">Insider Threat</option>
        <option value="DoS">Denial of Service (DoS)</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {/* Attackers */}
    <div className="mb-4">
      <label className="block mb-1">Attackers:</label>
      <select className="w-full px-3 py-2 border rounded" name="attackers" value={formData.attackers} onChange={handleInputChange} required>
        <option value="">Select Attackers</option>
        <option value="External">External</option>
        <option value="Internal">Internal</option>
        <option value="Unknown">Unknown</option>
      </select>
    </div>

    {/* 3. Response Actions Taken */}
    <h3 className="text-xl mb-2">3. Response Actions Taken</h3>
    {/* Containment */}
    <div className="mb-4">
      <label className="block mb-1">Containment:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="containment" value={formData.containment} onChange={handleInputChange} required  placeholder='Description of initial containment actions taken'/>
    </div>

    {/* Eradication */}
    <div className="mb-4">
      <label className="block mb-1">Eradication:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="eradication" value={formData.eradication} onChange={handleInputChange} required  placeholder='Description of steps taken to remove the threat'/>
    </div>

    {/* Recovery */}
    <div className="mb-4">
      <label className="block mb-1">Recovery:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="recovery" value={formData.recovery} onChange={handleInputChange} required  placeholder='Description of efforts to restore affected systems to normal operation'/>
    </div>

    {/* Lessons Learned */}
    <div className="mb-4">
      <label className="block mb-1">Lessons Learned:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="lessonsLearned" value={formData.lessonsLearned} onChange={handleInputChange} required placeholder='Key takeaways from the incident for future improvements'/>
    </div>

    {/* 4. Technical Analysis */}
    <h3 className="text-xl mb-2">4. Technical Analysis</h3>
    {/* Evidence */}
    <div className="mb-4">
      <label className="block mb-1">Evidence:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="evidence" value={formData.evidence} onChange={handleInputChange} required  placeholder='Logs, screenshots, or other evidence collected'/>
    </div>

    {/* Indicators of Compromise */}
    <div className="mb-4">
      <label className="block mb-1">Indicators of Compromise:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of identified IOCs' />
    </div>

    {/* Tactics, Techniques, and Procedures */}
    <div className="mb-4">
      <label className="block mb-1">Tactics, Techniques, and Procedures (TTPs):</label>
      <textarea className="w-full px-3 py-2 border rounded" name="ttps" value={formData.ttps} onChange={handleInputChange} required  placeholder='Description of attacker TTPs'/>
    </div>

    {/* Mitigation Recommendations */}
    <div className="mb-4">
      <label className="block mb-1">Mitigation Recommendations:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required  placeholder='Actions recommended to mitigate similar incidents in the future'/>
    </div>

    {/* 5. Communication */}
    <h3 className="text-xl mb-2">5. Communication</h3>
    {/* Internal Notification */}
    <div className="mb-4">
      <label className="block mb-1">Internal Notification:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="internalNotification" value={formData.internalNotification} onChange={handleInputChange} placeholder='List of team members or stakeholders notified' />
    </div>

    {/* External Notification */}
    <div className="mb-4">
      <label className="block mb-1">External Notification:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="externalNotification" value={formData.externalNotification} onChange={handleInputChange}  placeholder='List of external parties or authorities notified, if applicable'/>
    </div>

    {/* Updates */}
    <div className="mb-4">
      <label className="block mb-1">Updates:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="updates" value={formData.updates} onChange={handleInputChange} required  placeholder='Frequency and content of updates provided to stakeholders'/>
    </div>

    {/* 6. Follow-Up Actions */}
    <h3 className="text-xl mb-2">6. Follow-Up Actions</h3>
    {/* Incident Review */}
    <div className="mb-4">
      <label className="block mb-1">Incident Review:</label>
      <input className="w-full px-3 py-2 border rounded" type="datetime-local" name="incidentReview" value={formData.incidentReview} onChange={handleInputChange} />
    </div>

    {/* Documentation */}
    <div className="mb-4">
      <label className="block mb-1">Documentation:</label>
      <input className="mr-2" type="checkbox" name="documentation" checked={formData.documentation} onChange={handleInputChange} />
      <span>Is documentation complete?</span>
    </div>

    {/* Training */}
    <div className="mb-4">
      <label className="block mb-1">Training:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="training" value={formData.training} onChange={handleInputChange} required  placeholder='Identified training needs for team members based on incident response'/>
    </div>

    {/* 7. Additional Notes */}
    <h3 className="text-xl mb-2">7. Additional Notes</h3>
    {/* Additional Notes (optional) */}
    <div className="mb-4">
      <label className="block mb-1">Additional Notes (optional)</label>
      <textarea className="w-full px-3 py-2 border rounded" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
    </div>

    {/* 8. Submission */}
    <h3 className="text-xl mb-2">8. Submission</h3>
    {/* Prepared By */}
    <div className="mb-4">
      <label className="block mb-1">Prepared By</label>
      <textarea className="w-full px-3 py-2 border rounded" name="prepared" value={formData.prepared} onChange={handleInputChange} placeholder='Name of the individual(s) preparing the report' />
    </div>

    {/* 9. POC (Screenshots) */}
    <h3 className="text-xl mb-2">9. POC (Screenshots)</h3>
    {/* POC Screenshots */}
    <div className="mb-4">
      <label className="block mb-1">POC Screenshots (up to 5):</label>
      <input className="w-full" type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
    </div>

    {/* Submit Button */}
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" disabled={loading}>Submit</button>
  </form>
</div>

  );
}

export default IncidentReport;

