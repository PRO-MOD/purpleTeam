import React, { useEffect, useState, useContext } from 'react';
import ApexCharts from 'react-apexcharts';
import ColorContext from '../context/ColorContext';
import FontContext from '../context/FontContext';

function AdminDataVisualization() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const [highestScores, setHighestScores] = useState({
    highestManualScore: '',
    highestScore: '',
  });
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const [userScores, setUserScores] = useState([]);
  const [manualScores, setManualScores] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [submissionTypes, setSubmissionTypes] = useState([]);
  // const[mode,setMode]=useState("purpleTeam");
  const mode="ctfd";
  

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

      fetch(`${apiUrl}/api/submissions/all`,{
        method: 'GET',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),}
        
      })
      .then(res => res.json())
      .then(data => setSubmissionData(data))
      .catch(error => console.error('Error fetching submissions data:', error));

      // Fetch submission types count
    fetch(`${apiUrl}/api/submissions/submission-types-count`,{
      method: 'GET',
      headers: {
        'Auth-token': localStorage.getItem('Hactify-Auth-token'), // Include the auth token
      },

    })
    .then(res => res.json())
    .then(data => setSubmissionTypes(data))
    .catch(error => console.error('Error fetching submission types count:', error));
      

    // fetch(`${apiUrl}/api/config/mode`)
    //   .then(response => response.json())
    //   .then(data => {
    //     setMode(data.mode);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching mode:', error);
    //   });
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



  // const challengeTypeOptions = {
  //   chart: { type: 'bar' },
  //   plotOptions: {
  //     bar: { horizontal: true },
  //   },
  //   dataLabels: { enabled: false },
  //   xaxis: {
  //     categories: submissionTypes.map(user => user.type),
  //   },
  //   yaxis: {
  //     title: { text: 'Type of Challenges' },
  //   },
  //   title: {
  //     text: 'Type of Challenges',
  //     style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
  //   },
  //   grid: { borderColor: '#E2E8F0' },
  //   colors: ['#a00000'],
  // };

  const challengeTypeSeries = [{
    name: 'challengeType',
    data: submissionTypes.map(user => user.count),
  }];


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
      style: { ...headingFont, color: '#4A5568' },
    },
    grid: { borderColor: '#E2E8F0' },
    colors: ['#1a80bb'],
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
      style: { ...headingFont, color: '#4A5568' },
    },
    grid: { borderColor: '#E2E8F0' },
    colors: ['#a00000'],
  };

  const manualScoresSeries = [{
    name: 'Manual Score',
    data: manualScores.map(user => user.manualScore),
  }];


   // Process data for submissions by user
   const userSubmissionCounts = {};
   submissionData.forEach(submission => {
     const userName = submission.userId.name;
     userSubmissionCounts[userName] = (userSubmissionCounts[userName] || 0) + 1;
   });
 
   const userSubmissionsOptions = {
     chart: { type: 'bar' },
     plotOptions: { bar: { horizontal: true } },
     dataLabels: { enabled: false },
     xaxis: { categories: Object.keys(userSubmissionCounts) },
     title: {
       text: 'Number of Submissions by User',
       style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
     },
     grid: { borderColor: '#E2E8F0' },
     colors: ['#1a80bb'],
   };
   const userSubmissionsSeries = [{
     name: 'Submissions',
     data: Object.values(userSubmissionCounts),
   }];

    // Process data for correct vs incorrect submissions
    const correctIncorrectCounts = { correct: 0, incorrect: 0 };

    submissionData.forEach(submission => {
      if (submission.isCorrect) {
        correctIncorrectCounts.correct += 1;
      } else {
        correctIncorrectCounts.incorrect += 1;
      }
    });
    
    // Calculate total submissions
    const totalSubmissions = correctIncorrectCounts.correct + correctIncorrectCounts.incorrect;
    
    const correctIncorrectOptions = {
      chart: { type: 'pie' },
      labels: ['Correct', 'Incorrect'],
      title: {
        text: `Correct vs Incorrect Submissions`,
        style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
      },
      colors: ['#1a80bb', '#a00000'],
      legend: { position: 'bottom' },
    };
    
    const correctIncorrectSeries = [correctIncorrectCounts.correct, correctIncorrectCounts.incorrect];
    


   // Process data for submissions over time
   const submissionsOverTime = {};
   submissionData.forEach(submission => {
     const date = new Date(submission.date).toLocaleDateString('en-US');
     submissionsOverTime[date] = (submissionsOverTime[date] || 0) + 1;
   });
 
   const submissionsOverTimeOptions = {
     chart: { type: 'line' },
     xaxis: { type: 'datetime', title: { text: 'Date' } },
     yaxis: { title: { text: 'Number of Submissions' } },
     title: {
       text: 'Submissions Over Time',
       style: { ...headingFont, color: '#4A5568' },
     },
     grid: { borderColor: '#E2E8F0' },
     colors: ['#3182CE'],
   };
   const submissionsOverTimeSeries = [{
     name: 'Submissions',
     data: Object.keys(submissionsOverTime).map(date => ({
       x: new Date(date).getTime(),
       y: submissionsOverTime[date],
     })),
   }];
 // Process data for points scored by users
//  const userPoints = {};
//  submissionData.forEach(submission => {
//    const userName = submission.userId.name;
//    userPoints[userName] = (userPoints[userName] || 0) + submission.points;
//  });

//  const userPointsOptions = {
//    chart: { type: 'bar' },
//    plotOptions: { bar: { horizontal: true } },
//    dataLabels: { enabled: false },
//    xaxis: { categories: Object.keys(userPoints) },
//    title: {
//      text: 'Points Scored by Users',
//      style: { fontSize: '18px', fontWeight: 'bold', color: '#4A5568' },
//    },
//    grid: { borderColor: '#E2E8F0' },
//    colors: ['#a00000'],
//  };
//  const userPointsSeries = [{
//    name: 'Points',
//    data: Object.values(userPoints),
//  }];


  return (
    <div className="p-6 bg-gray-100 min-h-screen" style={{backgroundColor: bgColor}}>
      <div className="container mx-auto px-4">
        {/* Display the names of the leading teams */}
        <div className="mb-8 p-6 border border-gray-300 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={headingFont}>Leading Teams</h2>
          {mode==='purpleTeam' && (<p className="text-lg text-gray-600 mb-2" style={navbarFont}>
            Leading Team with Incident Response: <strong className="text-red-600">{highestScores.highestManualScore}</strong>
          </p>
          )}
          <p className="text-lg text-gray-600" style={navbarFont}>
            Leading Team with Total Score: <strong className="text-blue-600">{highestScores.highestTotalScore}</strong>
          </p>
        </div>

        {/* Grid for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Scores Chart */}
          <div id="user-scores-chart" className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={userScoresOptions} series={userScoresSeries} type="bar" height={320} />
          </div>

          {mode==='purpleTeam' &&(
          <div id="manual-scores-chart" className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={manualScoresOptions} series={manualScoresSeries} type="bar" height={320} />
          </div>
          )}


<div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={userSubmissionsOptions} series={userSubmissionsSeries} type="bar" height={320} />
          </div>
           {/* {mode==='ctfd' &&(
           <div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={challengeTypeOptions} series={challengeTypeSeries} type="bar" height={320} />
          </div>

        )} */}
        </div>

       

        {/* {mode==='purpleTeam' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {reportTimeSeries.map((chart, index) => (
            <div key={index} className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
              <ApexCharts options={chart.options} series={chart.series} type="line" height={320} />
            </div>
          ))}
        </div>
          )} */}

{mode === 'purpleTeam' && (
  <div
    className={`grid gap-8 mb-8 ${
      reportTimeSeries.length === 1
        ? 'grid-cols-1'
        : reportTimeSeries.length === 2
        ? 'grid-cols-2'
        : reportTimeSeries.length === 3
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2' // This will cover 4+ graphs
    }`}
  >
    {reportTimeSeries.map((chart, index) => (
      <div
        key={index}
        className="border border-gray-300 rounded-lg bg-white shadow-lg p-6"
        style={{ gridColumn: reportTimeSeries.length === 3 && index === 0 ? 'span 2' : 'span 1' }}
      >
        <ApexCharts options={chart.options} series={chart.series} type="line" height={320} />
      </div>
    ))}
  </div>
)}


        
{/* {mode==='purpleTeam' && (
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

)} */}


{mode === 'purpleTeam' && (
  <div
    className={`grid gap-8 mb-8 ${
      userPieCharts.length === 1
        ? 'grid-cols-1'
        : userPieCharts.length === 2
        ? 'grid-cols-2'
        : userPieCharts.length === 3
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2' // Covers 4+ charts
    }`}
  >
    {userPieCharts.map((chart, index) => (
      <div
        key={index}
        className="border border-gray-300 rounded-lg bg-white shadow-lg p-6 flex items-center"
        style={{ gridColumn: userPieCharts.length === 3 && index === 0 ? 'span 2' : 'span 1' }}
      >
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
)}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-8">
          {/* <div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={userSubmissionsOptions} series={userSubmissionsSeries} type="bar" height={320} />
          </div> */}
          {/* <div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={userPointsOptions} series={userPointsSeries} type="bar" height={320} />
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-8">
          <div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6">
            <ApexCharts options={submissionsOverTimeOptions} series={submissionsOverTimeSeries} type="line" height={320} />
          </div>
          <div className="border border-gray-300 rounded-lg bg-white shadow-lg p-6 flex items-center">
          <div className="w-2/3">
            <ApexCharts options={correctIncorrectOptions} series={correctIncorrectSeries} type="pie" height={320} />
            </div>
            <div className="w-1/3 pl-6 text-center">
                <p className="text-lg font-semibold text-gray-800">Total Submissions:</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
          </div>
        </div>
        

        {/* {mode==='purpleTeam' && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8 mt-8">
        <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4" style={headingFont}>Submissions Count by Challenge Type</h3>
            <ApexCharts options={challengeTypeOptions} series={challengeTypeSeries} type="bar" height={320} />
          </div>
          </div>
)} */}

        
      </div>
    </div>
  );
}

export default AdminDataVisualization;
