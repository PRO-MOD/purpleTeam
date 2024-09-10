// import React from 'react'

// function AdminDataVisualization() {
//     return (
//         <div className=''>
//             <iframe 
//             style={{
//                 background: '#F1F5F4',
//                 border: 'none',
//                 borderRadius: '2px',
//                 boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
//                 width: '98vw',
//                 height: '100vh',
//             }}
//                 src="https://charts.mongodb.com/charts-cyber_suraksha-ibxyqpa/embed/dashboards?id=42dac8e8-7a9a-4355-ac47-e56e5d842866&theme=light&autoRefresh=true&maxDataAge=300&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed&attribution=false">
//             </iframe>
//         </div>
//     )
// }

// export default AdminDataVisualization

import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';

function AdminDataVisualization() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [highestScores, setHighestScores] = useState({
    highestManualScore: '',
    highestScore: '',
  });
  const [userScores, setUserScores] = useState([]);
  const [manualScores, setManualScores] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch highest scores
    fetch(`${apiUrl}/api/score/highest-scores`)
      .then(res => res.json())
      .then(data => setHighestScores(data))
      .catch(error => console.error('Error fetching highest scores:', error));

    // Fetch user scores
    fetch(`${apiUrl}/api/score/user-scores`)
      .then(res => res.json())
      .then(data => setUserScores(data.userScores))
      .catch(error => console.error('Error fetching user scores:', error));
    
    // Fetch manual scores
    fetch(`${apiUrl}/api/score/user-manualscores`)
      .then(res => res.json())
      .then(data => setManualScores(data.userScores))
      .catch(error => console.error('Error fetching manual scores:', error));
    
    // Fetch report data
    fetch(`${apiUrl}/api/responses/unique-reports`)
      .then(res => res.json())
      .then(data => setReportData(data))
      .catch(error => console.error('Error fetching report data:', error));
  }, [apiUrl]);

  // Process data for total submissions over time
  const reportTimeSeries = reportData.map(report => {
    const submissionsByDate = {};

    report.users.forEach(submission => {
      const date = new Date(submission.createdAt).toLocaleDateString('en-US');
      if (!submissionsByDate[date]) {
        submissionsByDate[date] = 0;
      }
      submissionsByDate[date] += 1;
    });

    const seriesData = Object.keys(submissionsByDate).map(date => ({
      x: new Date(date).getTime(),
      y: submissionsByDate[date],
    }));

    return {
      name: report.reportName,
      options: {
        chart: {
          type: 'line',
          toolbar: { show: false },
        },
        xaxis: {
          type: 'datetime',
          title: { text: 'Date' },
        },
        yaxis: {
          title: { text: 'Number of Submissions' },
        },
        title: {
          text: `Submissions Over Time for ${report.reportName}`,
          style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        tooltip: {
          x: { format: 'dd MMM yyyy' },
        },
        grid: { borderColor: '#E2E8F0' },
        colors: ['#3182CE'],
      },
      series: [{
        name: 'Submissions',
        data: seriesData,
      }],
    };
  });

  // Process data for submissions by user
  const userPieCharts = reportData.map(report => {
    const userCounts = {};

    report.users.forEach(submission => {
      const { userName } = submission;
      if (!userCounts[userName]) {
        userCounts[userName] = 0;
      }
      userCounts[userName] += 1;
    });

    const seriesData = Object.keys(userCounts).map(userName => ({
      name: userName,
      data: userCounts[userName],
    }));

    const totalSubmissions = seriesData.reduce((sum, data) => sum + data.data, 0);

    return {
      name: report.reportName,
      totalSubmissions,
      options: {
        chart: {
          type: 'pie',
          toolbar: { show: false },
        },
        labels: seriesData.map(data => data.name),
        title: {
          text: `Submissions by User for ${report.reportName}`,
          style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: '14px', colors: ['#4A5568'] },
        },
        legend: { position: 'bottom' },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
            },
          },
        },
        colors: ['#F56565', '#F6E05E', '#48BB78', '#63B3ED', '#ED93D4', '#FBD38D'],
      },
      series: seriesData.map(data => data.data),
    };
  });

  const userScoresOptions = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: { horizontal: true },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: userScores.map(user => user.name),
    },
    yaxis: {
      title: { text: 'Score' },
    },
    title: {
      text: 'User Scores',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
    },
    grid: { borderColor: '#E2E8F0' },
    colors: ['#3182CE'],
  };

  const userScoresSeries = [{
    name: 'Score',
    data: userScores.map(user => user.score),
  }];

  const manualScoresOptions = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: { horizontal: true },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: manualScores.map(user => user.name),
    },
    yaxis: {
      title: { text: 'Manual Score' },
    },
    title: {
      text: 'Manual Scores',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
    },
    grid: { borderColor: '#E2E8F0' },
    colors: ['#F56565'],
  };

  const manualScoresSeries = [{
    name: 'Manual Score',
    data: manualScores.map(user => user.manualScore),
  }];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Display the names of the leading teams */}
        <div className="mb-8 p-6 border border-gray-300 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Leading Teams</h2>
          <p className="text-lg text-gray-600 mb-2">
            Leading Team with Incident Response: <strong className="text-green-600">{highestScores.highestManualScore}</strong>
          </p>
          <p className="text-lg text-gray-600">
            Leading Team with Service Availability: <strong className="text-blue-600">{highestScores.highestScore}</strong>
          </p>
        </div>

        {/* Grid for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Scores Chart */}
          <div id="user-scores-chart" className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={userScoresOptions} series={userScoresSeries} type="bar" height={320} />
          </div>

          {/* Manual Scores Chart */}
          <div id="manual-scores-chart" className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={manualScoresOptions} series={manualScoresSeries} type="bar" height={320} />
          </div>
        </div>

        {/* Report Time Series Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {reportTimeSeries.map((chart, index) => (
            <div key={index} className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
              <ApexCharts options={chart.options} series={chart.series} type="line" height={320} />
            </div>
          ))}
        </div>

        {/* Report Submissions by User Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userPieCharts.map((chart, index) => (
            <div key={index} className="border border-gray-300 rounded-lg bg-white shadow-lg p-6 flex items-center">
              <div className="w-2/3">
                <ApexCharts options={chart.options} series={chart.series} type="pie" height={320} />
              </div>
              <div className="w-1/3 pl-6 text-center">
                <p className="text-lg font-semibold text-gray-800">Total Submissions:</p>
                <p className="text-2xl font-bold text-gray-900">{chart.totalSubmissions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDataVisualization;
