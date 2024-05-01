
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    threatLevel: '',
    areasOfConcern: '',
    recentIncidents: '',
    trendAnalysis: '',
    impactAssessment: '',
    sources: '',
    keyThreatActors: '',
    indicatorsOfCompromise: '',
    recentVulnerabilities: '',
    patchStatus: '',
    mitigationRecommendations: '',
    currentOperations: '',
    incidentResponse: '',
    forensicAnalysis: '',
    internalNotifications: '',
    externalNotifications: '',
    publicRelations: '',
    riskAssessment: '',
    continuityPlanning: '',
    trainingAndExercises: '',
    pocScreenshots: [],
    pdfName: '',
    reportType: 'SITREP',
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
      const response = await fetch(`http://localhost:5000/api/reports/SITREP`, {
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
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
  <h2 className="text-3xl mb-4 text-center">SITREP Report Form</h2>
  {error && <div className="text-red-500 mb-4">Error: {error}</div>}
  <form onSubmit={handleSubmit}>
    {/* 1. Current Situation */}
    <h3 className="text-xl mb-2">1. Current Situation</h3>
    {/* Description */}
    <div className="mb-4">
      <label className="block mb-1">Description:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the current situation' />
    </div>

    {/* Threat Level */}
    <div className="mb-4">
      <label className="block mb-1">Threat Level:</label>
      <select className="w-full px-3 py-2 border rounded" name="threatLevel" value={formData.threatLevel} onChange={handleInputChange} required>
        <option value="">Select Threat Level</option>
        <option value="Low">Low</option>
        <option value="Guarded">Guarded</option>
        <option value="Elevated">Elevated</option>
        <option value="High">High</option>
        <option value="Severe">Severe</option>
      </select>
    </div>

    {/* Areas of Concern */}
    <div className="mb-4">
      <label className="block mb-1">Areas of Concern:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="areasOfConcern" value={formData.areasOfConcern} onChange={handleInputChange} placeholder='List of current security concerns or vulnerabilities' />
    </div>

    {/* 2. Incident Overview */}
    <h3 className="text-xl mb-2">2. Incident Overview</h3>
    {/* Recent Incidents */}
    <div className="mb-4">
      <label className="block mb-1">Recent Incidents:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="recentIncidents" value={formData.recentIncidents} onChange={handleInputChange} required placeholder='Summary of recent security incidents or events' />
    </div>

    {/* Trend Analysis */}
    <div className="mb-4">
      <label className="block mb-1">Trend Analysis:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="trendAnalysis" value={formData.trendAnalysis} onChange={handleInputChange} required placeholder='Analysis of trends in security incidents or threats' />
    </div>

    {/* Impact Assessment */}
    <div className="mb-4">
      <label className="block mb-1">Impact Assessment:</label>
      <textarea className="w-full px-3 py-2 border rounded" name="impactAssessment" value={formData.impactAssessment} onChange={handleInputChange} required placeholder='Assessment of the potential impact of current threats' />
    </div>

    {/* ... Other sections follow */}
{/* 3. Threat Intelligence */}
<h3 className="text-xl mb-2">3. Threat Intelligence</h3>
{/* Sources */}
<div className="mb-4">
  <label className="block mb-1">Sources:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="sources" value={formData.sources} onChange={handleInputChange} placeholder='List of sources for threat intelligence' />
</div>

{/* Key Threat Actors */}
<div className="mb-4">
  <label className="block mb-1">Key Threat Actors:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="keyThreatActors" value={formData.keyThreatActors} onChange={handleInputChange} required placeholder='Summary of known threat actors and their activities' />
</div>

{/* Indicators of Compromise */}
<div className="mb-4">
  <label className="block mb-1">Indicators of Compromise:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of relevant IOCs' />
</div>

{/* 4. Vulnerability Management */}
<h3 className="text-xl mb-2">4. Vulnerability Management</h3>
{/* Recent Vulnerabilities */}
<div className="mb-4">
  <label className="block mb-1">Recent Vulnerabilities:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="recentVulnerabilities" value={formData.recentVulnerabilities} onChange={handleInputChange} required  placeholder='Summary of recently discovered vulnerabilities'/>
</div>

{/* Patch Status */}
<div className="mb-4">
  <label className="block mb-1">Patch Status:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="patchStatus" value={formData.patchStatus} onChange={handleInputChange} required placeholder='Overview of patching efforts and status' />
</div>

{/* Mitigation Recommendations */}
<div className="mb-4">
  <label className="block mb-1">Mitigation Recommendations:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required placeholder='Recommendations for mitigating known vulnerabilities' />
</div>

{/* 5. Security Operations */}
<h3 className="text-xl mb-2">5. Security Operations</h3>
{/* Current Operations */}
<div className="mb-4">
  <label className="block mb-1">Current Operations:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="currentOperations" value={formData.currentOperations} onChange={handleInputChange} required placeholder='Overview of ongoing security operations or activities' />
</div>

{/* Incident Response */}
<div className="mb-4">
  <label className="block mb-1">Incident Response:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="incidentResponse" value={formData.incidentResponse} onChange={handleInputChange} required placeholder='Summary of recent incident response activities'/>
</div>

{/* Forensic Analysis */}
<div className="mb-4">
  <label className="block mb-1">Forensic Analysis:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="forensicAnalysis" value={formData.forensicAnalysis} onChange={handleInputChange} required  placeholder='Status of ongoing forensic analysis efforts'/>
</div>

{/* 6. Communication */}
<h3 className="text-xl mb-2">6. Communication</h3>
{/* Internal Notifications */}
<div className="mb-4">
  <label className="block mb-1">Internal Notifications:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="internalNotifications" value={formData.internalNotifications} onChange={handleInputChange} placeholder='List of internal stakeholders notified of current situation' />
</div>

{/* External Notifications */}
<div className="mb-4">
  <label className="block mb-1">External Notifications:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="externalNotifications" value={formData.externalNotifications} onChange={handleInputChange} placeholder='List of external parties or authorities notified, if applicable' />
</div>

{/* Public Relations */}
<div className="mb-4">
  <label className="block mb-1">Public Relations:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="publicRelations" value={formData.publicRelations} onChange={handleInputChange} required placeholder='Summary of public relations or communication efforts' />
</div>

{/* 7. Future Planning */}
<h3 className="text-xl mb-2">7. Future Planning</h3>
{/* Risk Assessment */}
<div className="mb-4">
  <label className="block mb-1">Risk Assessment:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="riskAssessment" value={formData.riskAssessment} onChange={handleInputChange} required  placeholder='Summary of current risk assessment efforts'/>
</div>

{/* Continuity Planning */}
<div className="mb-4">
  <label className="block mb-1">Continuity Planning:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="continuityPlanning" value={formData.continuityPlanning} onChange={handleInputChange} required  placeholder='Overview of continuity planning efforts'/>
</div>

{/* Training and Exercises */}
<div className="mb-4">
  <label className="block mb-1">Training and Exercises:</label>
  <textarea className="w-full px-3 py-2 border rounded" name="trainingAndExercises" value={formData.trainingAndExercises} onChange={handleInputChange} required placeholder='Summary of upcoming training or exercises' />
</div>

{/* 8. Additional Notes (Optional) */}
<h3 className="text-xl mb-2">8. Additional Notes</h3>
<div className="mb-4">
  <label className="block mb-1">Additional Notes (optional)</label>
  <textarea className="w-full px-3 py-2 border rounded" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
</div>

{/* 9. Submission */}
<h3 className="text-xl mb-2">9. Submission</h3>
<div className="mb-4">
  <label className="block mb-1">Prepared By</label>
  <textarea className="w-full px-3 py-2 border rounded" name="prepared" value={formData.prepared} onChange={handleInputChange} placeholder='Name of the individual(s) preparing the report' />
</div>

{/* 10. POC (Screenshots) */}
<h3 className="text-xl mb-2">10. POC (Screenshots)</h3>
<div className="mb-4">
  <label className="block mb-1">Screenshots (up to 5):</label>
  <input className="w-full" type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
</div>

<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>Submit</button>
</form>
</div>

  );
}

export default Report;
