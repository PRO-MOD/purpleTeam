
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
      const response = await fetch(`http://13.233.214.116:5000/api/reports/SITREP`, {
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
      <h2 className="text-3xl mb-8 text-center font-bold text-blue-500">SITREP Report Form</h2>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Current Situation */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">1. Current Situation</h3>
          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700">Description:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="description" value={formData.description} onChange={handleInputChange} required placeholder='Brief summary of the current situation' />
          </div>

          {/* Threat Level */}
          <div>
            <label className="block mb-1 text-gray-700">Threat Level:</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="threatLevel" value={formData.threatLevel} onChange={handleInputChange} required>
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
            <label className="block mb-1 text-gray-700">Areas of Concern:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="areasOfConcern" value={formData.areasOfConcern} onChange={handleInputChange} placeholder='List of current security concerns or vulnerabilities' />
          </div>
        </div>


        {/* 2. Incident Overview */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">2. Incident Overview</h3>
          {/* Recent Incidents */}
          <div>
            <label className="block mb-1 text-gray-700">Recent Incidents:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="recentIncidents" value={formData.recentIncidents} onChange={handleInputChange} required placeholder='Summary of recent security incidents or events' />
          </div>

          {/* Trend Analysis */}
          <div>
            <label className="block mb-1 text-gray-700">Trend Analysis:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="trendAnalysis" value={formData.trendAnalysis} onChange={handleInputChange} required placeholder='Analysis of trends in security incidents or threats' />
          </div>

          {/* Impact Assessment */}
          <div>
            <label className="block mb-1 text-gray-700">Impact Assessment:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="impactAssessment" value={formData.impactAssessment} onChange={handleInputChange} required placeholder='Assessment of the potential impact of current threats' />
          </div>
        </div>

        {/* 3. Threat Intelligence */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">3. Threat Intelligence</h3>
          {/* Sources */}
          <div>
            <label className="block mb-1 text-gray-700">Sources:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="sources" value={formData.sources} onChange={handleInputChange} placeholder='List of sources for threat intelligence' />
          </div>

          {/* Key Threat Actors */}
          <div>
            <label className="block mb-1 text-gray-700">Key Threat Actors:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="keyThreatActors" value={formData.keyThreatActors} onChange={handleInputChange} required placeholder='Summary of known threat actors and their activities' />
          </div>

          {/* Indicators of Compromise */}
          <div>
            <label className="block mb-1 text-gray-700">Indicators of Compromise:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="indicatorsOfCompromise" value={formData.indicatorsOfCompromise} onChange={handleInputChange} placeholder='List of relevant IOCs' />
          </div>
        </div>

        {/* 4. Vulnerability Management */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">4. Vulnerability Management</h3>
          {/* Recent Vulnerabilities */}
          <div>
            <label className="block mb-1 text-gray-700">Recent Vulnerabilities:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="recentVulnerabilities" value={formData.recentVulnerabilities} onChange={handleInputChange} required placeholder='Summary of recently discovered vulnerabilities' />
          </div>

          {/* Patch Status */}
          <div>
            <label className="block mb-1 text-gray-700">Patch Status:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="patchStatus" value={formData.patchStatus} onChange={handleInputChange} required placeholder='Overview of patching efforts and status' />
          </div>

          {/* Mitigation Recommendations */}
          <div>
            <label className="block mb-1 text-gray-700">Mitigation Recommendations:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="mitigationRecommendations" value={formData.mitigationRecommendations} onChange={handleInputChange} required placeholder='Recommendations for mitigating known vulnerabilities' />
          </div>
        </div>

        {/* 5. Security Operations */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">5. Security Operations</h3>
          {/* Current Operations */}
          <div>
            <label className="block mb-1 text-gray-700">Current Operations:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="currentOperations" value={formData.currentOperations} onChange={handleInputChange} required placeholder='Overview of ongoing security operations or activities' />
          </div>

          {/* Incident Response */}
          <div>
            <label className="block mb-1 text-gray-700">Incident Response:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="incidentResponse" value={formData.incidentResponse} onChange={handleInputChange} required placeholder='Summary of recent incident response activities' />
          </div>

          {/* Forensic Analysis */}
          <div>
            <label className="block mb-1 text-gray-700">Forensic Analysis:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="forensicAnalysis" value={formData.forensicAnalysis} onChange={handleInputChange} required placeholder='Status of ongoing forensic analysis efforts' />
          </div>
        </div>

        {/* 6. Communication */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">6. Communication</h3>
          {/* Internal Notifications */}
          <div>
            <label className="block mb-1 text-gray-700">Internal Notifications:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="internalNotifications" value={formData.internalNotifications} onChange={handleInputChange} placeholder='List of internal stakeholders notified of current situation' />
          </div>

          {/* External Notifications */}
          <div>
            <label className="block mb-1 text-gray-700">External Notifications:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="externalNotifications" value={formData.externalNotifications} onChange={handleInputChange} placeholder='List of external parties or authorities notified, if applicable' />
          </div>

          {/* Public Relations */}
          <div>
            <label className="block mb-1 text-gray-700">Public Relations:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="publicRelations" value={formData.publicRelations} onChange={handleInputChange} required placeholder='Summary of public relations or communication efforts' />
          </div>
        </div>

        {/* 7. Future Planning */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">7. Future Planning</h3>
          {/* Risk Assessment */}
          <div>
            <label className="block mb-1 text-gray-700">Risk Assessment:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="riskAssessment" value={formData.riskAssessment} onChange={handleInputChange} required placeholder='Summary of current risk assessment efforts' />
          </div>

          {/* Continuity Planning */}
          <div>
            <label className="block mb-1 text-gray-700">Continuity Planning:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="continuityPlanning" value={formData.continuityPlanning} onChange={handleInputChange} required placeholder='Overview of continuity planning efforts' />
          </div>

          {/* Training and Exercises */}
          <div>
            <label className="block mb-1 text-gray-700">Training and Exercises:</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="trainingAndExercises" value={formData.trainingAndExercises} onChange={handleInputChange} required placeholder='Summary of upcoming training or exercises' />
          </div>
        </div>

        {/* 8. Additional Notes (Optional) */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">8. Additional Notes</h3>
          <div>
            <label className="block mb-1 text-gray-700">Additional Notes (optional)</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="notes" value={formData.notes} onChange={handleInputChange} placeholder='Space for any additional comments or observations' />
          </div>
        </div>

        {/* 9. Submission */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">9. Submission</h3>
          <div>
            <label className="block mb-1 text-gray-700">Prepared By</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" name="prepared" value={formData.prepared} onChange={handleInputChange} placeholder='Name of the individual(s) preparing the report' />
          </div>
        </div>

        {/* 10. POC (Screenshots) */}
        <div>
          <h3 className="text-xl mb-2 font-semibold text-gray-800">10. POC (Screenshots)</h3>
          <div>
            <label className="block mb-1 text-gray-700">Screenshots (up to 5):</label>
            <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" type="file" name="pocScreenshots" multiple onChange={handleInputChange} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
}


export default Report;
