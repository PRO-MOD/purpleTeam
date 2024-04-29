import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function IncidentReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    severityLevel: '',
    impact: '',
    affectedSystems: [],
    detectionMethod: '',
    initialDetectionTime: '',
    attackVector: '',
    attackers: '',
    containment: '',
    eradication: '',
    recovery: '',
    lessonsLearned: '',
    evidence: '',
    indicatorsOfCompromise: [],
    ttps: '',
    mitigationRecommendations: '',
    internalNotification: [],
    externalNotification: [],
    updates: '',
    incidentReview: '',
    documentation: false,
    training: '',
    pocScreenshots: [],
    pdfName: '',
    ReportType:'',
    userId: '', 
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // const handleInputChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === 'pocScreenshots') { // Adjusted condition to match file input name
  //     // If input is for screenshots, check if the number of screenshots exceeds 5
  //     if (formData.pocScreenshots.length >= 5) { // Adjusted property name to match state
  //       alert("You can't add more than 5 screenshots");
  //       return;
  //     }
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       pocScreenshots: [...prevData.pocScreenshots, ...files], // Adjusted property name to match state
  //     }));
  //   }
  //   else {
  //     // Otherwise, update form data normally
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      // For checkboxes, set the value to true if checked, false otherwise
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
      setLoading(true); // Set loading state to true
      setError(''); // Clear previous errors
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
  
        {/* Severity Level */}
        <div>
          <label>Severity Level:</label>
          <select name="severityLevel" value={formData.severityLevel} onChange={handleInputChange} required>
            <option value="">Select Severity Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
  
        {/* Impact */}
        <div>
          <label>Impact:</label>
          <select name="impact" value={formData.impact} onChange={handleInputChange} required>
            <option value="">Select Impact</option>
            <option value="Minimal">Minimal</option>
            <option value="Moderate">Moderate</option>
            <option value="Significant">Significant</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
  
        {/* Affected Systems */}
        <div>
          <label>Affected Systems:</label>
          <textarea name="affectedSystems" value={formData.affectedSystems} onChange={handleInputChange} />
        </div>
  
        {/* Detection Method */}
        <div>
          <label>Detection Method:</label>
          <input type="text" name="detectionMethod" value={formData.detectionMethod} onChange={handleInputChange} required />
        </div>
  
        {/* Initial Detection Time */}
        <div>
          <label>Initial Detection Time:</label>
          <input type="datetime-local" name="initialDetectionTime" value={formData.initialDetectionTime} onChange={handleInputChange} required />
        </div>
  
        {/* Attack Vector */}
        <div>
          <label>Attack Vector:</label>
          <select name="attackVector" value={formData.attackVector} onChange={handleInputChange} required>
            <option value="">Select Attack Vector</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Insider Threat">Insider Threat</option>
            <option value="DoS">Denial of Service (DoS)</option>
            <option value="Other">Other</option>
          </select>
        </div>
  
        {/* Attackers */}
        <div>
          <label>Attackers:</label>
          <select name="attackers" value={formData.attackers} onChange={handleInputChange} required>
            <option value="">Select Attackers</option>
            <option value="External">External</option>
            <option value="Internal">Internal</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
  
        {/* Containment */}
        <div>
          <label>Containment:</label>
          <textarea name="containment" value={formData.containment} onChange={handleInputChange} required />
        </div>
  
        {/* Eradication */}
        <div>
          <label>Eradication:</label>
          <textarea name="eradication" value={formData.eradication} onChange={handleInputChange} required />
        </div>
  
        {/* Recovery */}
        <div>
          <label>Recovery:</label>
          <textarea name="recovery" value={formData.recovery} onChange={handleInputChange} required />
        </div>
  
        {/* Lessons Learned */}
        <div>
          <label>Lessons Learned:</label>
          <textarea name="lessonsLearned" value={formData.lessonsLearned} onChange={handleInputChange} required />
        </div>
  
        {/* Evidence */}
        <div>
          <label>Evidence:</label>
          <textarea name="evidence" value={formData.evidence} onChange={handleInputChange} required />
        </div>
  
        {/* Indicators of Compromise */}
        <div>
          <label>Indicators of Compromise:</label>
          <textarea name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} />
        </div>
  
        {/* Tactics, Techniques, and Procedures */}
        <div>
          <label>Tactics, Techniques, and Procedures (TTPs):</label>
          <textarea name="ttps" value={formData.ttps} onChange={handleInputChange} required />
        </div>
  
        {/* Mitigation Recommendations */}
        <div>
          <label>Mitigation Recommendations:</label>
          <textarea name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required />
        </div>
  
        {/* Internal Notification */}
        <div>
          <label>Internal Notification:</label>
          <textarea name="internalNotification" value={formData.internalNotification} onChange={handleInputChange} />
        </div>
  
        {/* External Notification */}
        <div>
          <label>External Notification:</label>
          <textarea name="externalNotification" value={formData.externalNotification} onChange={handleInputChange} />
        </div>
  
        {/* Updates */}
        <div>
          <label>Updates:</label>
          <textarea name="updates" value={formData.updates} onChange={handleInputChange} required />
        </div>
  
        {/* Incident Review */}
        <div>
          <label>Incident Review:</label>
          <input type="datetime-local" name="incidentReview" value={formData.incidentReview} onChange={handleInputChange} />
        </div>
  
        {/* Documentation */}
        <div>
          <label>Documentation:</label>
          <input type="checkbox" name="documentation" checked={formData.documentation} onChange={handleInputChange} />
        </div>
  
        {/* Training */}
        <div>
          <label>Training:</label>
          <textarea name="training" value={formData.training} onChange={handleInputChange} required />
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

export default IncidentReport;

