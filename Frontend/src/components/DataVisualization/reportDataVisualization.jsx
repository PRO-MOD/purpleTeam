// import { useContext } from 'react';


// // DataVisualizationInitial.js
// import React from 'react';
// import Chart from 'react-apexcharts';
// import FontContext from '../../context/FontContext';
// import ColorContext from '../../context/ColorContext';

// const ReportDataVisualization = ({ jsonData, scoreData }) => {
//   // Fallback if scoreData or jsonData is not available
//   if (!scoreData || !jsonData) {
//     return <div className="p-4 text-center">Loading data...</div>;
//   }
//   const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
//   const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  
//   // Bar chart for score
//   const barChartOptions = {
//     chart: {
//       type: 'bar',
//     },
//     xaxis: {
//       categories: ['Manual Score', 'Score'],
//     },
//     title: {
//       text: 'User Scores',
//     },
//     colors: ['#a00000'], // Applying the specified color for the bars
//   };
//   const barChartData = [
//     {
//       name: 'Score',
//       data: [scoreData.manualScore || 0, scoreData.score || 0],
//     },
//   ];

//   // Pie chart for different report names
//   const reportNames = [...new Set(jsonData.map((report) => report.reportName))];
//   const reportCounts = reportNames.map((name) =>
//     jsonData.filter((report) => report.reportName === name).length
//   );
//   const pieChartOptions = {
//     labels: reportNames,
//     title: {
//       text: 'Report Distribution',
//     },
//     colors: ['#d8a6a6', '#a00000'], // Applying the specified colors for the pie slices
//   };
//   const pieChartData = reportCounts;

//   // Line chart for submissions over time
//   const lineChartOptions = {
//     chart: {
//       type: 'line',
//     },
//     xaxis: {
//       categories: jsonData.map((report) => report.responseDate),
//     },
//     title: {
//       text: 'Submissions Over Time',
//     },
//     colors: ['#d8a6a6'], // Applying the specified color for the line
//   };
//   const lineChartData = [
//     {
//       name: 'Submissions',
//       data: jsonData.map((_, index) => index + 1),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4" style={{font:headingFont}}> Report Data Visualization</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Bar Chart for Scores */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={barChartOptions} series={barChartData} type="bar" height={350} />
//         </div>
//         {/* Pie Chart for Report Distribution */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={pieChartOptions} series={pieChartData} type="pie" height={350} />
//         </div>
//         {/* Line Chart for Submissions Over Time (Reports) */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <Chart options={lineChartOptions} series={lineChartData} type="line" height={350} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportDataVisualization;

import { useContext } from 'react';
import React from 'react';
import Chart from 'react-apexcharts';
import FontContext from '../../context/FontContext';
import ColorContext from '../../context/ColorContext';

const ReportDataVisualization = ({ jsonData, scoreData }) => {
  if (!scoreData || !jsonData) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  const { navbarFont, headingFont, paraFont, updateFontSettings } = useContext(FontContext);
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);

  // Bar chart for score
  const barChartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Manual Score', 'Score'],
    },
    title: {
      text: 'User Scores',
    },
    colors: ['#3652f3', '#4c66f4'], // Different shades for the bars
  };
  const barChartData = [
    {
      name: 'Score',
      data: [scoreData.manualScore || 0, scoreData.score || 0],
    },
  ];

  // // Pie chart for different report names
  // const reportNames = [...new Set(jsonData.map((report) => report.reportName))];
  // const reportCounts = reportNames.map((name) =>
  //   jsonData.filter((report) => report.reportName === name).length
  // );
  // const pieChartOptions = {
  //   labels: reportNames,
  //   title: {
  //     text: 'Report Distribution',
  //   },
  //   colors: ['#3652f3', '#4c66f4', '#6379f5', '#7a8df6', '#1f3ae1'], // Shades for pie slices
  // };
  // const pieChartData = reportCounts;

  // Correct processing for pie chart data
const reportNames = [...new Set(jsonData.map((report) => report.reportName))];
const reportCounts = reportNames.map((name) =>
  jsonData.filter((report) => report.reportName === name).length
);

// Updated pie chart options
const pieChartOptions = {
  chart: {
    type: 'pie',
  },
  labels: reportNames,
  title: {
    text: 'Report Distribution',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
  legend: {
    position: 'bottom',
  },
  colors: ['#3652f3', '#4c66f4', '#6379f5', '#7a8df6', '#1f3ae1'], // Ensure you have enough colors
};

// Updated pie chart data
const pieChartData = reportCounts.length > 0 ? reportCounts : [1]; // Avoid empty series


  // Line chart for submissions over time
  const lineChartOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: jsonData.map((report) => report.responseDate),
    },
    title: {
      text: 'Submissions Over Time',
    },
    colors: ['#3652f3'], // Use the primary shade for the line
  };
  const lineChartData = [
    {
      name: 'Submissions',
      data: jsonData.map((_, index) => index + 1),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4" style={{ font: headingFont }}>
        Report Data Visualization
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bar Chart for Scores */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={barChartOptions} series={barChartData} type="bar" height={350} />
        </div>
        {/* Pie Chart for Report Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={pieChartOptions} series={pieChartData} type="pie" height={350} />
        </div>
        {/* Line Chart for Submissions Over Time (Reports) */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Chart options={lineChartOptions} series={lineChartData} type="line" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ReportDataVisualization;
