// // DataVisualizationAdditional.js
// import React from 'react';
// import Chart from 'react-apexcharts';

// const ChallengesDataVisualization = ({ submissionData, submissionTypes }) => {
//   // Fallback if submissionData or submissionTypes is not available
//   if (!submissionData || !submissionTypes) {
//     return <div className="p-4 text-center">Loading data...</div>;
//   }

//   // New Pie chart for Correct vs. Incorrect Submissions
//   const correctCount = submissionData.filter(submission => submission.isCorrect).length;
//   const incorrectCount = submissionData.length - correctCount;
//   const correctVsIncorrectPieChartOptions = {
//     labels: ['Correct', 'Incorrect'],
//     title: {
//       text: 'Correct vs Incorrect Submissions',
//     },
//   };
//   const correctVsIncorrectPieChartData = [correctCount, incorrectCount];

//   // New Bar chart for Types of Submissions Count
//   const submissionTypesNames = submissionTypes.map(type => type.type);
//   const submissionTypesCounts = submissionTypes.map(type => type.count);
//   const submissionTypesBarChartOptions = {
//     chart: {
//       type: 'bar',
//     },
//     xaxis: {
//       categories: submissionTypesNames,
//     },
//     title: {
//       text: 'Types of Submissions Count',
//     },
//   };
//   const submissionTypesBarChartData = [
//     {
//       name: 'Submission Types',
//       data: submissionTypesCounts,
//     },
//   ];

//   // New Line chart for Submissions Over Time (based on submissionData)
//   const submissionDates = [...new Set(submissionData.map(submission => submission.date.split('T')[0]))];
//   const submissionsOverTimeData = submissionDates.map(date => {
//     return submissionData.filter(submission => submission.date.split('T')[0] === date).length;
//   });
//   const submissionsOverTimeLineChartOptions = {
//     chart: {
//       type: 'line',
//     },
//     xaxis: {
//       categories: submissionDates,
//     },
//     title: {
//       text: 'Submissions Over Time (Detailed)',
//     },
//   };
//   const submissionsOverTimeLineChartData = [
//     {
//       name: 'Submissions',
//       data: submissionsOverTimeData,
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Challenges Data Visualization</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Pie Chart for Correct vs Incorrect Submissions */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={correctVsIncorrectPieChartOptions} series={correctVsIncorrectPieChartData} type="pie" height={350} />
//         </div>
//         {/* Bar Chart for Types of Submissions Count */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={submissionTypesBarChartOptions} series={submissionTypesBarChartData} type="bar" height={350} />
//         </div>
//         {/* Line Chart for Submissions Over Time (Detailed) */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={submissionsOverTimeLineChartOptions} series={submissionsOverTimeLineChartData} type="line" height={350} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChallengesDataVisualization;


// DataVisualizationAdditional.js
import React from 'react';
import Chart from 'react-apexcharts';

const ChallengesDataVisualization = ({ submissionData, submissionTypes }) => {
  // Fallback if submissionData or submissionTypes is not available
  if (!submissionData || !submissionTypes) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  // New Pie chart for Correct vs. Incorrect Submissions
  const correctCount = submissionData.filter(submission => submission.isCorrect).length;
  const incorrectCount = submissionData.length - correctCount;
  const correctVsIncorrectPieChartOptions = {
    labels: ['Correct', 'Incorrect'],
    title: {
      text: 'Correct vs Incorrect Submissions',
    },
    colors: ['#d8a6a6', '#a00000'], // Applying the specified colors
  };
  const correctVsIncorrectPieChartData = [correctCount, incorrectCount];

  // New Bar chart for Types of Submissions Count
  const submissionTypesNames = submissionTypes.map(type => type.type);
  const submissionTypesCounts = submissionTypes.map(type => type.count);
  const submissionTypesBarChartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: submissionTypesNames,
    },
    title: {
      text: 'Types of Submissions Count',
    },
    colors: ['#a00000'], // Applying the specified color for bars
  };
  const submissionTypesBarChartData = [
    {
      name: 'Submission Types',
      data: submissionTypesCounts,
    },
  ];

  // New Line chart for Submissions Over Time (based on submissionData)
  const submissionDates = [...new Set(submissionData.map(submission => submission.date.split('T')[0]))];
  const submissionsOverTimeData = submissionDates.map(date => {
    return submissionData.filter(submission => submission.date.split('T')[0] === date).length;
  });
  const submissionsOverTimeLineChartOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: submissionDates,
    },
    title: {
      text: 'Submissions Over Time (Detailed)',
    },
    colors: ['#d8a6a6'], // Applying the specified color for the line
  };
  const submissionsOverTimeLineChartData = [
    {
      name: 'Submissions',
      data: submissionsOverTimeData,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Challenges Data Visualization</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pie Chart for Correct vs Incorrect Submissions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={correctVsIncorrectPieChartOptions} series={correctVsIncorrectPieChartData} type="pie" height={350} />
        </div>
        {/* Bar Chart for Types of Submissions Count */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={submissionTypesBarChartOptions} series={submissionTypesBarChartData} type="bar" height={350} />
        </div>
        {/* Line Chart for Submissions Over Time (Detailed) */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={submissionsOverTimeLineChartOptions} series={submissionsOverTimeLineChartData} type="line" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChallengesDataVisualization;
