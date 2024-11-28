


// // DataVisualizationAdditional.js
// import React from 'react';
// import Chart from 'react-apexcharts';
// import { useContext } from 'react';
// import FontContext from '../../context/FontContext';

// const ChallengesDataVisualization = ({ submissionData, submissionTypes }) => {
//   // Fallback if submissionData or submissionTypes is not available
//   if (!submissionData || !submissionTypes) {
//     return <div className="p-4 text-center">Loading data...</div>;
//   }
//   const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
//   // New Pie chart for Correct vs. Incorrect Submissions
//   const correctCount = submissionData.filter(submission => submission.isCorrect).length;
//   const incorrectCount = submissionData.length - correctCount;
//   const correctVsIncorrectPieChartOptions = {
//     labels: ['Correct', 'Incorrect'],
//     title: {
//       text: 'Correct vs Incorrect Submissions',
//     },
//     colors: ['#d8a6a6', '#a00000'], // Applying the specified colors
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
//     colors: ['#a00000'], // Applying the specified color for bars
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
//     colors: ['#d8a6a6'], // Applying the specified color for the line
//   };
//   const submissionsOverTimeLineChartData = [
//     {
//       name: 'Submissions',
//       data: submissionsOverTimeData,
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4" style={{fontFamily: headingFont}}>Challenges Data Visualization</h2>
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


import React from 'react';
import Chart from 'react-apexcharts';
import { useContext } from 'react';
import FontContext from '../../context/FontContext';

const ChallengesDataVisualization = ({ submissionData,  hintCost }) => {
  if (!submissionData || !hintCost) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  const { navbarFont, headingFont, paraFont, updateFontSettings } = useContext(FontContext);

  // Shades of #3652f3
  const primaryColor = '#3652f3'; // Primary
  const lighterShade1 = '#4c66f4'; // Lighter
  const lighterShade2 = '#6379f5'; // Even lighter
  const lighterShade3 = '#7a8df6'; // Lightest
  const darkerShade = '#1f3ae1'; // Darker

  // Pie chart for Correct vs. Incorrect Submissions
  const correctCount = submissionData.filter(submission => submission.isCorrect).length;
  const incorrectCount = submissionData.length - correctCount;
  const correctVsIncorrectPieChartOptions = {
    labels: ['Correct', 'Incorrect'],
    title: {
      text: 'Correct vs Incorrect Submissions',
    },
    colors: [primaryColor, lighterShade1], // Different shades for pie slices
  };
  const correctVsIncorrectPieChartData = [correctCount, incorrectCount];

  // Bar chart for Types of Submissions Count
  // const submissionTypesNames = submissionTypes.map(type => type.type);
  // const submissionTypesCounts = submissionTypes.map(type => type.count);
  // const submissionTypesBarChartOptions = {
  //   chart: {
  //     type: 'bar',
  //   },
  //   xaxis: {
  //     categories: submissionTypesNames,
  //   },
  //   title: {
  //     text: 'Types of Submissions Count',
  //   },
  //   colors: [primaryColor], // Primary color for bars
  // };
  // const submissionTypesBarChartData = [
  //   {
  //     name: 'Submission Types',
  //     data: submissionTypesCounts,
  //   },
  // ];


//   // Data Preparation
const challengeNames = hintCost.map(cost => cost.name);
const challengeValues = hintCost.map(cost => cost.totalValue);

// Bar Chart Configuration
const challengeBarChartOptions = {
  chart: {
    type: 'bar',
  },
  xaxis: {
    categories: challengeNames, // Challenge names as X-axis categories
  },
  title: {
    text: 'Challenges vs Total hint Cost',
  },
  colors: [primaryColor], // Primary color for bars
};

const challengeBarChartData = [
  {
    name: 'Total Cost',
    data: challengeValues, // Total values for each challenge
  },
];


  // Line chart for Submissions Over Time (based on submissionData)
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
    colors: [lighterShade2], // Another shade for the line
  };
  const submissionsOverTimeLineChartData = [
    {
      name: 'Submissions',
      data: submissionsOverTimeData,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: headingFont }}>Challenges Data Visualization</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pie Chart for Correct vs Incorrect Submissions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={correctVsIncorrectPieChartOptions} series={correctVsIncorrectPieChartData} type="pie" height={350} />
        </div>
        {/* Bar Chart for Types of Submissions Count */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={submissionTypesBarChartOptions} series={submissionTypesBarChartData} type="bar" height={350} />
        </div> */}

<div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={challengeBarChartOptions} series={challengeBarChartData} type="bar" height={350} />
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
