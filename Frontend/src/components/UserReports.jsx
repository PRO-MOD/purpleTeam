


import React, { useState, useEffect } from 'react';

function UserReports({ userId, route }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedScores, setAssignedScores] = useState([]);
  const [penalty, setPenalty] = useState(0);

  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    if (!userId) return;
    if (!userId) return;

    fetch(`${apiUrl}/api/responses/all/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
    })
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error('Error fetching reports:', err));
  }, [userId, apiUrl]);

  const viewDetails = (responseId) => {
    fetch(`${apiUrl}/api/responses/detail/${responseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
    })
      .then(res => res.json())
      .then(data => {
        setSelectedReport(data);
        setAssignedScores(data.responses.map(response => ({
          ...response,
          assignedScore: response.assignedScore || 0,
        })));
        setPenalty(data.penaltyScore || 0);
        setShowModal(true);
      })
      .catch(err => console.error('Error fetching response details:', err));
  };

  const handleScoreChange = (index, value) => {
    setAssignedScores(prevScores => {
      const updatedScores = [...prevScores];
      updatedScores[index].assignedScore = Math.max(0, Math.min(value, updatedScores[index].maxScore));
      return updatedScores;
    });
  };

  const handlePenaltyChange = (value) => {
    setPenalty(Math.max(0, value));
  };

  const handleUpdateScores = () => {
    const updatedResponses = assignedScores.map(({ questionId, assignedScore }) => ({
      questionId,
      assignedScore,
    }));

    const totalAssignedScore = assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0);
    const finalScore = totalAssignedScore - penalty;

    fetch(`${apiUrl}/api/responses/update/${selectedReport._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('Hactify-Auth-token'),
      },
      body: JSON.stringify({
        updatedResponses,
        penaltyScore: penalty,
        finalScore,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          console.error('Error updating scores:', result.error);
          return;
        }
        setShowModal(false);
        setReports(reports.map(report =>
          report._id === selectedReport._id ? { ...report, finalScore } : report
        ));
      })
      .catch(err => console.error('Error updating scores:', err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Reports</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Report Name</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">Total Score</th>
            <th className="px-4 py-2 border-b">Action</th>
            <th className="px-4 py-2 border-b">View Report</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id}>
              <td className="px-4 py-2 border-b">{report.reportName}</td>
              <td className="px-4 py-2 border-b">{report.responseDate}</td>
              <td className="px-4 py-2 border-b">{report.responseTime}</td>
              <td className="px-4 py-2 border-b">{report.finalScore || 0}</td>
              <td className="px-4 py-2 border-b">
              <button
  onClick={() => viewDetails(report._id)}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  {route === 'progress' ? 'Detailed Score' : 'Assign'}
</button>

              </td>
              <td className="px-4 py-2 border-b">
                <button
                  // onClick={() => viewDetails(report._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl max-h-[80%] overflow-y-scroll">
            <h3 className="text-xl font-semibold mb-4">{selectedReport.reportName}</h3>
            <p className="mb-2">Date: {selectedReport.responseDate}</p>
            <p className="mb-4">Time: {selectedReport.responseTime}</p>
            <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Question</th>
                  <th className="px-4 py-2 border-b">Answer</th>
                  <th className="px-4 py-2 border-b">Max Score</th>
                  <th className="px-4 py-2 border-b">Assigned Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedScores.map((response, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{response.question}</td>
                    <td className="px-4 py-2 border-b">{response.answer}</td>
                    <td className="px-4 py-2 border-b">{response.maxScore}</td>
                    <td className="px-4 py-2 border-b">
  <input
    type="number"
    value={response.assignedScore}
    onChange={(e) => handleScoreChange(index, Number(e.target.value))}
    className="w-full px-2 py-1 border border-gray-300 rounded"
    disabled={route === 'progress'}
  />
</td>

                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">Total Assigned Score:</td>
                  <td className="px-4 py-2 border-b">
                    {assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">Penalty:</td>
                  <td className="px-4 py-2 border-b">

                      <input
                        type="number"
                        value={penalty}
                        onChange={(e) => handlePenaltyChange(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        disabled={route === 'progress'}

                      />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 font-semibold">Final Score:</td>
                  <td className="px-4 py-2">
                    {assignedScores.reduce((sum, { assignedScore }) => sum + assignedScore, 0) - penalty}
                  </td>
                </tr>
              </tfoot>
            </table>
            {route !== 'progress' && (
              <button
                onClick={handleUpdateScores}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Scores
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReports;
