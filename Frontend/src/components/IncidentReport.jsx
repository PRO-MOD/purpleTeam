
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
    pocScreenshots: [],
    pdfName: '',
    ReportType:'IRREP',
    userId: '', 
    other:'',
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
  
      // // Now, append the images to the FormData object
      // formData.pocScreenshots.forEach((file) => {
      //   formDataToSend.append('pocScreenshots', file);
      // });
  
      const response = await fetch(`http://13.127.232.191:5000/api/reports/IRREP`, {
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
  <h2 className="text-3xl mb-4 text-center font-bold text-brown-650">Incident Report Form</h2>
  {error && <div className="text-red-500 mb-4">Error: {error}</div>}
  <form onSubmit={handleSubmit}>
    {/* 1. Incident Overview */}
    <h3 className="text-xl mb-2">1. Incident Overview</h3>
    {/* Description */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Description:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the incident' />
    </div>

    {/* Severity Level */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Severity Level:</label>
      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="severityLevel" value={formData.severityLevel} onChange={handleInputChange} required>
        <option value="">Select Severity Level</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
    </div>

    {/* Impact */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Impact:</label>
      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="impact" value={formData.impact} onChange={handleInputChange} required>
        <option value="">Select Impact</option>
        <option value="Minimal">Minimal</option>
        <option value="Moderate">Moderate</option>
        <option value="Significant">Significant</option>
        <option value="Severe">Severe</option>
      </select>
    </div>

    {/* Affected Systems */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Affected Systems:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="affectedSystems" value={formData.affectedSystems} onChange={handleInputChange} placeholder='List of systems or assets affected' />
    </div>

    {/* 2. Incident Details */}
    <h3 className="text-xl mb-2">2. Incident Details</h3>
    {/* Detection Method */}
    {/* <div className="mb-4">
      <label className="block mb-1 text-gray-700">Detection Method:</label>
      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} required>
        <option value="">Select Detection Method</option>
        <option value="Intrusion Detection System">Intrusion Detection System</option>
        <option value="Security Information and Event Management (SIEM)">Security Information and Event Management (SIEM)</option>
        <option value="Endpoint Detection and Response (EDR)">Endpoint Detection and Response (EDR)</option>
        <option value="User Report">User Report</option>
        <option value="Other">Other</option>
      </select>
    </div> */}

<div className="mb-4">
  <label className="block mb-1 text-gray-700">Detection Method:</label>
  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} required>
    <option value="">Select Detection Method</option>
    <option value="Intrusion Detection System">Intrusion Detection System</option>
    <option value="Security Information and Event Management (SIEM)">Security Information and Event Management (SIEM)</option>
    <option value="Endpoint Detection and Response (EDR)">Endpoint Detection and Response (EDR)</option>
    <option value="User Report">User Report</option>
    <option value="Other">Other</option>
  </select>
  {formData.detectionMethod === "Other" && (
    <input
      type="text"
      className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500"
      name="other"
      value={formData.other}
      onChange={handleInputChange}
      placeholder="Enter Detection Method"
      required
    />
  )}
</div>


    {/* Initial Detection Time */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Initial Detection Time:</label>
      <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" type="datetime-local" name="initialDetectionTime" value={formData.initialDetectionTime} onChange={handleInputChange} required />
    </div>

    {/* Attack Vector */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Attack Vector:</label>
      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="attackVector" value={formData.attackVector} onChange={handleInputChange} required>
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
      <label className="block mb-1 text-gray-700">Attackers:</label>
      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="attackers" value={formData.attackers} onChange={handleInputChange} required>
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
      <label className="block mb-1 text-gray-700">Containment:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="containment" value={formData.containment} onChange={handleInputChange} required  placeholder='Description of initial containment actions taken'/>
    </div>

    {/* Eradication */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Eradication:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="eradication" value={formData.eradication} onChange={handleInputChange} required  placeholder='Description of steps taken to remove the threat'/>
    </div>

    {/* Recovery */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Recovery:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="recovery" value={formData.recovery} onChange={handleInputChange} required  placeholder='Description of efforts to restore affected systems to normal operation'/>
    </div>

    {/* Lessons Learned */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Lessons Learned:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="lessonsLearned" value={formData.lessonsLearned} onChange={handleInputChange} required placeholder='Key takeaways from the incident for future improvements'/>
    </div>

    {/* 4. Technical Analysis */}
    <h3 className="text-xl mb-2">4. Technical Analysis</h3>
    {/* Evidence */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Evidence:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="evidence" value={formData.evidence} onChange={handleInputChange} required  placeholder='Logs, screenshots, or other evidence collected'/>
    </div>

    {/* Indicators of Compromise */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Indicators of Compromise:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of identified IOCs' />
    </div>

    {/* Tactics, Techniques, and Procedures */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Tactics, Techniques, and Procedures (TTPs):</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="ttps" value={formData.ttps} onChange={handleInputChange} required  placeholder='Description of attacker TTPs'/>
    </div>

    {/* Mitigation Recommendations */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Mitigation Recommendations:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required  placeholder='Actions recommended to mitigate similar incidents in the future'/>
    </div>

    {/* 5. Communication */}
    <h3 className="text-xl mb-2">5. Communication</h3>
    {/* Internal Notification */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Internal Notification:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="internalNotification" value={formData.internalNotification} onChange={handleInputChange} placeholder='List of team members or stakeholders notified' />
    </div>

    {/* External Notification */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">External Notification:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="externalNotification" value={formData.externalNotification} onChange={handleInputChange}  placeholder='List of external parties or authorities notified, if applicable'/>
    </div>

    {/* Updates */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Updates:</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="updates" value={formData.updates} onChange={handleInputChange} required  placeholder='Frequency and content of updates provided to stakeholders'/>
    </div>


    {/* 7. Additional Notes */}
    <h3 className="text-xl mb-2">6. Additional Notes</h3>
    {/* Additional Notes (optional) */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Additional Notes (optional)</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
    </div>

    {/* 8. Submission */}
    <h3 className="text-xl mb-2">7. Submission</h3>
    {/* Prepared By */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Prepared By</label>
      <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none  focus:border-brown-500" name="prepared" value={formData.prepared} onChange={handleInputChange} placeholder='Name of the individual(s) preparing the report' />
    </div>

    {/* 9. POC (Screenshots) */}
    <h3 className="text-xl mb-2">8. POC (Screenshots)</h3>
    {/* POC Screenshots */}
    <div className="mb-4">
      <label className="block mb-1 text-gray-700">POC Screenshots (up to 5):</label>
      <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brown-500" type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
    </div>

    {/* Submit Button */}
    <button className="w-full bg-brown-650  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" type="submit" disabled={loading}>Submit</button>
  </form>
</div>


  );
}

export default IncidentReport;

